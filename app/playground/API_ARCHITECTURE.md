# Playground API Architecture

**Approach:** Leverage existing Next.js API routes pattern from `/app/api/chat/`

---

## Current Pattern (From Chat)

```
User Request
    ↓
Next.js API Route (/app/api/chat/route.ts)
    ↓
spawn Python process (child_process.exec)
    ↓
lib/amplifier-chat.py
    ↓
Amplifier Foundation executes
    ↓
Python prints JSON to stdout
    ↓
API route parses and returns JSON
    ↓
Client receives response
```

**Advantages:**
- ✅ Simple - no separate backend server
- ✅ Works today - already handling chat
- ✅ Environment variables pass through automatically
- ✅ Easy to debug (just run Python script directly)
- ✅ Deploys as single Next.js app

**Current Limitations:**
- ⚠️ No streaming progress (just final result)
- ⚠️ 30-second timeout for long executions
- ⚠️ One execution at a time (synchronous)
- ⚠️ 1MB buffer limit for large outputs

---

## Playground Endpoints (New)

### 1. `/app/api/playground/examples/route.ts`

**Purpose:** Get list of all examples

**Approach A: Static JSON (Recommended for MVP)**
```typescript
export async function GET() {
  // Read from /public/examples/index.json
  const examplesPath = path.join(process.cwd(), 'public', 'examples', 'index.json');
  const data = JSON.parse(fs.readFileSync(examplesPath, 'utf-8'));
  
  return Response.json(data);
}
```

**Approach B: Generate on-demand (Future)**
```typescript
export async function GET() {
  // Spawn Python script to list examples from GitHub
  const scriptPath = path.join(process.cwd(), 'lib', 'list-examples.py');
  const { stdout } = await execAsync(`python "${scriptPath}"`);
  
  return Response.json(JSON.parse(stdout));
}
```

### 2. `/app/api/playground/examples/[id]/route.ts`

**Purpose:** Get specific example details

```typescript
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const examplePath = path.join(
    process.cwd(), 
    'public', 
    'examples', 
    `${params.id}.json`
  );
  
  if (!fs.existsSync(examplePath)) {
    return Response.json({ error: 'Example not found' }, { status: 404 });
  }
  
  const data = JSON.parse(fs.readFileSync(examplePath, 'utf-8'));
  return Response.json(data);
}
```

### 3. `/app/api/playground/execute/route.ts`

**Purpose:** Execute an example

**Pattern:** Same as chat, but with example-specific parameters

```typescript
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Increase for longer examples

interface ExecuteRequest {
  exampleId: string;      // e.g., "01_hello_world"
  inputs?: Record<string, any>;  // User-provided inputs
  mode?: string;          // normie, explorer, developer, expert
}

interface ExecuteResponse {
  success: boolean;
  output: string;
  executionTimeMs: number;
  error?: string;
}

export async function POST(request: Request) {
  try {
    const body: ExecuteRequest = await request.json();
    const { exampleId, inputs = {}, mode = 'normie' } = body;

    if (!exampleId) {
      return Response.json(
        { error: 'Example ID is required' },
        { status: 400 }
      );
    }

    // Path to Python execution script
    const scriptPath = path.join(process.cwd(), 'lib', 'run-example.py');

    // Prepare arguments
    const args = JSON.stringify({ exampleId, inputs, mode });
    const escapedArgs = args.replace(/"/g, '\\"');

    // Execute Python script
    const startTime = Date.now();
    const command = `python "${scriptPath}" "${escapedArgs}"`;

    console.log(`Executing example: ${exampleId}`);
    
    const { stdout, stderr } = await execAsync(command, {
      timeout: 60000, // 60 second timeout
      maxBuffer: 5 * 1024 * 1024, // 5MB buffer for large outputs
      env: { ...process.env },
    });

    if (stderr) {
      console.warn('Python stderr:', stderr);
    }

    const executionTimeMs = Date.now() - startTime;

    // Parse JSON response from Python
    const result = JSON.parse(stdout);

    return Response.json({
      success: true,
      output: result.output,
      executionTimeMs,
      metadata: result.metadata,
    });

  } catch (error: any) {
    console.error('Execute API error:', error);

    // Try to parse error output as JSON
    if (error.stdout) {
      try {
        const errorData = JSON.parse(error.stdout);
        return Response.json(
          { success: false, error: errorData.error },
          { status: 500 }
        );
      } catch {
        // Not JSON, fall through
      }
    }

    return Response.json(
      {
        success: false,
        error: 'Failed to execute example',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
```

---

## Python Scripts (New)

### `/lib/run-example.py`

**Purpose:** Execute an example from amplifier-foundation

```python
#!/usr/bin/env python3
"""
Execute an amplifier-foundation example with user inputs.
"""

import sys
import json
import asyncio
import traceback
from pathlib import Path

async def run_example(example_id: str, inputs: dict, mode: str) -> dict:
    """
    Load and execute an example.
    
    Args:
        example_id: Example file ID (e.g., "01_hello_world")
        inputs: User-provided inputs for interactive examples
        mode: View mode (normie, explorer, developer, expert)
    
    Returns:
        Dict with output and metadata
    """
    try:
        # Import amplifier foundation
        from amplifier_foundation import load_bundle
        
        # Load example configuration
        # This would load the actual example from amplifier-foundation
        # For now, placeholder logic:
        
        if example_id == "01_hello_world":
            # Simple example - just run the hello world pattern
            foundation_path = Path(__file__).parent.parent
            foundation = await load_bundle(str(foundation_path))
            
            # Load provider
            provider_path = foundation_path / "providers" / "anthropic-sonnet.yaml"
            provider = await load_bundle(str(provider_path))
            
            # Compose and prepare
            composed = foundation.compose(provider)
            prepared = await composed.prepare()
            session = await prepared.create_session()
            
            # Execute
            async with session:
                response = await session.execute(
                    "Write a Python function to check if a number is prime."
                )
            
            return {
                "output": response,
                "metadata": {
                    "example_id": example_id,
                    "mode": mode,
                }
            }
        
        # Add more examples here...
        else:
            return {
                "error": f"Example {example_id} not implemented yet"
            }
    
    except Exception as e:
        return {
            "error": f"Execution failed: {str(e)}",
            "traceback": traceback.format_exc()
        }

def main():
    """Main entry point."""
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No arguments provided"}))
        sys.exit(1)
    
    try:
        # Parse arguments from JSON
        args = json.loads(sys.argv[1])
        example_id = args.get("exampleId")
        inputs = args.get("inputs", {})
        mode = args.get("mode", "normie")
        
        # Run example
        result = asyncio.run(run_example(example_id, inputs, mode))
        
        # Print result as JSON
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({
            "error": f"Failed to parse arguments: {str(e)}",
            "traceback": traceback.format_exc()
        }))
        sys.exit(1)

if __name__ == "__main__":
    main()
```

---

## Scalability Improvements

### Near-Term (Weeks 1-2)

**1. Rate Limiting**
Add simple in-memory rate limiting:

```typescript
// lib/rate-limiter.ts
const executionCounts = new Map<string, number[]>();

export function checkRateLimit(ip: string, limit: number = 10): boolean {
  const now = Date.now();
  const hourAgo = now - 3600000;
  
  // Get recent executions for this IP
  const executions = executionCounts.get(ip) || [];
  const recentExecutions = executions.filter(time => time > hourAgo);
  
  if (recentExecutions.length >= limit) {
    return false; // Rate limit exceeded
  }
  
  // Add new execution
  recentExecutions.push(now);
  executionCounts.set(ip, recentExecutions);
  
  return true;
}
```

**2. Execution Queue**
Handle concurrent requests:

```typescript
// lib/execution-queue.ts
class ExecutionQueue {
  private queue: Array<() => Promise<any>> = [];
  private running = 0;
  private maxConcurrent = 3; // Run 3 examples at once

  async add<T>(fn: () => Promise<T>): Promise<T> {
    if (this.running >= this.maxConcurrent) {
      await new Promise(resolve => {
        const checkQueue = () => {
          if (this.running < this.maxConcurrent) {
            resolve(null);
          } else {
            setTimeout(checkQueue, 100);
          }
        };
        checkQueue();
      });
    }

    this.running++;
    try {
      return await fn();
    } finally {
      this.running--;
    }
  }
}

export const executionQueue = new ExecutionQueue();
```

**3. Better Error Handling**
Categorize errors for user-friendly messages:

```typescript
function categorizeError(error: any): { message: string; retryable: boolean } {
  if (error.message.includes('timeout')) {
    return {
      message: 'Example took too long to execute. Try a simpler example.',
      retryable: true
    };
  }
  
  if (error.message.includes('ENOENT')) {
    return {
      message: 'Example file not found. Please try another example.',
      retryable: false
    };
  }
  
  if (error.message.includes('API key')) {
    return {
      message: 'AI service is temporarily unavailable.',
      retryable: true
    };
  }
  
  return {
    message: 'An unexpected error occurred.',
    retryable: true
  };
}
```

### Medium-Term (Weeks 3-4)

**1. Add Streaming Support**
For real-time progress updates:

```typescript
// Use Server-Sent Events (SSE) for streaming
export async function POST(request: Request) {
  // ... parse request ...
  
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial status
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ status: 'starting' })}\n\n`)
      );
      
      // Execute with progress callbacks
      await executeWithProgress(exampleId, inputs, (progress) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(progress)}\n\n`)
        );
      });
      
      controller.close();
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

**2. Session Pooling**
Pre-warm Python sessions (similar to warmup endpoint):

```typescript
// lib/session-pool.ts
class SessionPool {
  private sessions: any[] = [];
  private maxSessions = 5;
  
  async getSession() {
    if (this.sessions.length > 0) {
      return this.sessions.pop();
    }
    return await this.createSession();
  }
  
  async releaseSession(session: any) {
    if (this.sessions.length < this.maxSessions) {
      this.sessions.push(session);
    }
  }
  
  private async createSession() {
    // Spawn pre-warmed Python process
    // Keep it alive for reuse
  }
}
```

**3. Caching**
Cache example metadata and module downloads:

```typescript
// Use Next.js built-in caching
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  // Cached for 1 hour
  const examples = await fetchExamples();
  return Response.json(examples);
}
```

### Long-Term (Phase 2+)

If we outgrow Next.js API routes:
1. **Separate Python backend** (FastAPI) with WebSocket support
2. **Background job queue** (Bull, Redis) for long-running examples
3. **Distributed caching** (Redis) for session state
4. **Load balancing** across multiple Python workers

But for MVP and likely Phase 1, **Next.js API routes will be plenty**.

---

## Deployment Considerations

### Vercel (Recommended)
- Next.js API routes work out of the box
- Need to ensure Python runtime is available
- May need to use Edge Runtime with Python layer

### Azure Container Apps (Alternative)
- Full control over Python environment
- Can run longer-executing examples (no 60s limit)
- More complex deployment

### Azure Static Web Apps (Current?)
- Check if Python execution is supported
- May need to switch to Container Apps for playground

---

## Testing Strategy

**1. Test Python scripts directly:**
```bash
cd lib
python run-example.py '{"exampleId":"01_hello_world","inputs":{},"mode":"normie"}'
```

**2. Test API routes locally:**
```bash
npm run dev
curl -X POST http://localhost:3000/api/playground/execute \
  -H "Content-Type: application/json" \
  -d '{"exampleId":"01_hello_world"}'
```

**3. Load testing:**
```bash
# Use Apache Bench or similar
ab -n 100 -c 10 -p request.json http://localhost:3000/api/playground/execute
```

---

## Migration Path from Chat Pattern

**What to reuse:**
- ✅ `execAsync` pattern with timeout and buffer
- ✅ JSON communication (Python prints to stdout)
- ✅ Environment variable passing
- ✅ Error handling structure

**What to improve:**
- 🔄 Add rate limiting
- 🔄 Increase timeout for longer examples (60s)
- 🔄 Increase buffer for larger outputs (5MB)
- 🔄 Add execution queue for concurrency
- 🔄 Better error categorization

**What to add later:**
- 📅 Streaming progress (Phase 2)
- 📅 Session pooling (Phase 2)
- 📅 Distributed caching (Phase 2)

---

## Summary

**MVP Approach:**
1. Use Next.js API routes (just like chat)
2. Store examples as static JSON files
3. Python script executes examples on-demand
4. Add basic rate limiting
5. Deploy with Next.js app (single deployment)

**This gives us:**
- ✅ Simple architecture
- ✅ Easy debugging
- ✅ Fast iteration
- ✅ Single deployment artifact
- ✅ Known pattern (chat already works)

**We can scale later by:**
- Adding execution queue
- Implementing streaming
- Moving to separate Python backend only if needed

**Start simple. Scale when needed.** 🚀
