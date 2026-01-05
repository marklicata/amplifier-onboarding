# Technical Architecture

## Overview

The Amplifier web experience is a **browser-based application** that lets users run, explore, and create Amplifier content without local installation. Built for Azure, designed for **simplicity and speed**.

### Core Design Principles

1. **No persistence** - Ephemeral usage only, users export locally
2. **GitHub OAuth** - Required for Playground access, enables rate limiting
3. **Pre-warmed sessions** - Fast execution without Docker overhead
4. **Event-heavy analytics** - Track everything for insights
5. **Separate CI/CD** - Independent frontend and backend deployments
6. **Minimal infrastructure** - PostgreSQL + Application Insights only

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        User's Browser                       │
│                                                             │
│  Next.js React App (Static)                                │
│  ├─ UI Components                                          │
│  ├─ Monaco Editor (code editing)                           │
│  ├─ React Flow (visual builder)                            │
│  └─ WebSocket Client (real-time updates)                   │
│  └─ Analytics (event tracking)                             │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTPS / WebSocket
                   │
┌──────────────────┴──────────────────────────────────────────┐
│                    Azure Static Web Apps                    │
│                                                             │
│  Static Assets (HTML, JS, CSS)                             │
│  ├─ Homepage                                               │
│  ├─ Learn content                                          │
│  └─ Playground UI                                          │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ API Calls
                   │
┌──────────────────┴──────────────────────────────────────────┐
│             Azure Container Apps (API Backend)              │
│                                                             │
│  FastAPI + Python                                          │
│  ├─ /api/auth         → GitHub OAuth                       │
│  ├─ /api/execute      → Run Amplifier in pre-warmed pool   │
│  ├─ /api/validate     → Validate recipes/bundles           │
│  ├─ /api/gallery      → Browse pre-built content (static)  │
│  └─ /ws/stream        → WebSocket real-time streaming      │
│                                                             │
│  Pre-Warmed Amplifier Session Pool                         │
│  ├─ 5-10 warm sessions ready                              │
│  └─ Instant execution (no cold start)                      │
└──────────────────┬──────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌────────────────┐  ┌──────────────────┐
│  PostgreSQL    │  │   Application    │
│                │  │   Insights       │
│  Gallery data  │  │                  │
│  Rate limits   │  │  All events      │
│  (minimal)     │  │  All analytics   │
└────────────────┘  └──────────────────┘
```

---

## Frontend Architecture

### Technology Stack

**Core:**
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI Library:** React 18
- **Styling:** Tailwind CSS + Shadcn/ui components
- **State Management:** Zustand (lightweight)
- **API Client:** TanStack Query (React Query)

**Specialized:**
- **Code Editor:** Monaco Editor (VS Code in browser)
- **Visual Builder:** React Flow (node-based diagrams)
- **Real-time:** WebSocket client for streaming
- **Animation:** Framer Motion

**Build:**
- **Bundler:** Turbo (built into Next.js)
- **Testing:** Vitest + Playwright
- **CI/CD:** GitHub Actions

### Key Features

#### 1. Real-Time Execution Viewer

```typescript
// Execution streaming component
export function ExecutionViewer({ sessionId }: { sessionId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const ws = useWebSocket(`wss://api.amplifier.dev/ws/stream/${sessionId}`);

  useEffect(() => {
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setMessages(prev => [...prev, update]);
    };
  }, [ws]);

  return (
    <div className="execution-stream">
      {messages.map(msg => (
        <ExecutionStep key={msg.id} step={msg} />
      ))}
    </div>
  );
}
```

**Features:**
- Step-by-step progress
- Agent invocations shown
- Tool calls logged
- Context accumulation visible
- Scrolls automatically
- Pausable/resumable

#### 2. Monaco Code Editor Integration

```typescript
// YAML editor with intelligence
export function YAMLEditor({ value, onChange }: EditorProps) {
  const handleMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    // Register custom completions for Amplifier YAML
    monaco.languages.registerCompletionItemProvider('yaml', {
      provideCompletionItems: (model, position) => {
        return {
          suggestions: getAmplifierCompletions(model, position)
        };
      }
    });

    // Live validation
    monaco.languages.registerDocumentFormattingEditProvider('yaml', {
      provideDocumentFormattingEdits: (model) => {
        return validateAmplifierYAML(model.getValue());
      }
    });
  };

  return (
    <MonacoEditor
      language="yaml"
      theme="vs-dark"
      value={value}
      onChange={onChange}
      onMount={handleMount}
      options={{
        minimap: { enabled: false },
        lineNumbers: 'on',
        // Amplifier-specific options
      }}
    />
  );
}
```

**Features:**
- Syntax highlighting
- Autocomplete for Amplifier constructs
- Live validation
- Error highlighting
- Format on save

#### 3. Visual Recipe Builder

```typescript
// React Flow integration
export function RecipeBuilder() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onConnect = useCallback((connection: Connection) => {
    setEdges(eds => addEdge(connection, eds));
  }, []);

  const toYAML = useCallback(() => {
    return generateRecipeYAML(nodes, edges);
  }, [nodes, edges]);

  return (
    <div className="flex h-screen">
      <AgentPalette />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={customNodeTypes}
      >
        <Background />
        <Controls />
      </ReactFlow>
      <PropertiesPanel />
      <YAMLPreview yaml={toYAML()} />
    </div>
  );
}
```

### Deployment

**Azure Static Web Apps:**
- Automatic builds from GitHub
- Global CDN distribution
- Custom domains
- Automatic HTTPS
- Preview deployments for PRs

**Build Process:**
```bash
# Build static site
npm run build

# Outputs to: .next/static
# Deployed to: Azure Static Web Apps
```

**Configuration:**
```json
// staticwebapp.config.json
{
  "routes": [
    { "route": "/api/*", "rewrite": "https://api.amplifier.dev/api/*" },
    { "route": "/*", "serve": "/index.html", "statusCode": 200 }
  ],
  "navigationFallback": {
    "rewrite": "/index.html"
  }
}
```

---

## Backend Architecture

### Technology Stack

**Core:**
- **Framework:** FastAPI (Python 3.11+)
- **ASGI Server:** Uvicorn
- **Task Queue:** Azure Service Bus (or Celery + Redis)
- **Database:** Azure Database for PostgreSQL
- **Cache:** Azure Redis Cache
- **Storage:** Azure Blob Storage

**Key Libraries:**
- **amplifier-core:** Kernel for session execution
- **amplifier-foundation:** Foundation bundle
- **Pydantic v2:** Request/response validation
- **SQLAlchemy 2.0:** ORM
- **Alembic:** Migrations

**Observability:**
- **Logging:** Azure Application Insights
- **Monitoring:** Azure Monitor
- **Tracing:** OpenTelemetry

### Directory Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── auth.py             # GitHub OAuth
│   │   │   ├── execute.py          # Execute bundles/recipes
│   │   │   ├── validate.py         # Validate YAML
│   │   │   ├── gallery.py          # Static gallery content
│   │   │   └── analytics.py        # Event logging
│   │   └── deps.py                 # Dependencies
│   ├── core/
│   │   ├── config.py               # Settings
│   │   ├── auth.py                 # GitHub OAuth + JWT
│   │   ├── session_pool.py         # Pre-warmed sessions
│   │   ├── rate_limiter.py         # Rate limiting
│   │   ├── analytics.py            # Event tracking
│   │   └── streaming.py            # WebSocket management
│   ├── schemas/                    # Pydantic schemas
│   │   ├── execution.py
│   │   ├── recipe.py
│   │   └── bundle.py
│   ├── services/                   # Business logic
│   │   ├── executor.py             # Execute in session pool
│   │   ├── validator.py            # YAML validation
│   │   └── gallery.py              # Load static gallery
│   └── main.py                     # FastAPI app
├── gallery/                        # Static pre-built content
│   ├── recipes/
│   ├── bundles/
│   └── skills/
├── tests/
├── Dockerfile
└── requirements.txt
```

### Key Components

#### 1. Pre-Warmed Session Pool

**Challenge:** Execute Amplifier sessions instantly without cold start.

**Solution:** Pool of pre-warmed sessions ready to execute

```python
# app/core/session_pool.py
from amplifier_foundation import Bundle
from asyncio import Queue
import asyncio

class SessionPool:
    """Maintain pool of warm Amplifier sessions"""

    def __init__(self, pool_size: int = 5):
        self.pool_size = pool_size
        self.available = Queue(maxsize=pool_size)
        self.in_use = {}

    async def start(self):
        """Pre-warm sessions on startup"""
        for _ in range(self.pool_size):
            session = await self._create_session()
            await self.available.put(session)

        # Background task to maintain pool
        asyncio.create_task(self._maintain_pool())

    async def _create_session(self):
        """Create and prepare an Amplifier session"""
        # Load foundation bundle
        bundle = await Bundle.from_yaml("foundation")
        prepared = await bundle.prepare()

        # Create session (ready to use)
        session = await prepared.create_session()

        return {
            "session": session,
            "created_at": datetime.utcnow(),
            "executions": 0
        }

    async def acquire(self, timeout: float = 30.0):
        """Get a session from pool"""
        try:
            session_data = await asyncio.wait_for(
                self.available.get(),
                timeout=timeout
            )
            session_id = id(session_data["session"])
            self.in_use[session_id] = session_data
            return session_data["session"], session_id
        except asyncio.TimeoutError:
            raise Exception("No sessions available")

    async def release(self, session_id: str):
        """Return session to pool"""
        if session_id not in self.in_use:
            return

        session_data = self.in_use.pop(session_id)
        session_data["executions"] += 1

        # Recreate session after 10 uses (prevent memory leaks)
        if session_data["executions"] >= 10:
            await session_data["session"].close()
            session_data = await self._create_session()

        await self.available.put(session_data)

    async def _maintain_pool(self):
        """Background task to keep pool healthy"""
        while True:
            await asyncio.sleep(60)  # Check every minute

            # Refresh old sessions (> 30 min)
            # ... implementation ...

# Global pool instance
session_pool = SessionPool(pool_size=5)
```

**Benefits:**
- **Instant execution** - No container spin-up time
- **Simple** - Just Python process, no Docker complexity
- **Cost-effective** - Reuse sessions across requests
- **Reliable** - Pre-warmed and tested

#### 2. Real-Time Streaming

**WebSocket Implementation:**

```python
# app/api/routes/execute.py
from fastapi import WebSocket, WebSocketDisconnect

@router.websocket("/ws/stream/{session_id}")
async def stream_execution(
    websocket: WebSocket,
    session_id: str,
    current_user = Depends(get_current_user)
):
    """Stream execution updates in real-time"""

    await websocket.accept()

    try:
        # Subscribe to execution events
        async for event in execution_service.stream(session_id):
            # Send update to client
            await websocket.send_json({
                "type": event.type,
                "data": event.data,
                "timestamp": event.timestamp.isoformat()
            })

            # Check if execution complete
            if event.type in ["execution:complete", "execution:error"]:
                break

    except WebSocketDisconnect:
        # Client disconnected, execution continues
        pass
    except Exception as e:
        await websocket.send_json({
            "type": "error",
            "message": str(e)
        })
    finally:
        await websocket.close()
```

#### 3. Execution Service

```python
# app/services/executor.py
from app.core.session_pool import session_pool
from app.core.analytics import track_event

class ExecutionService:
    """Execute bundles and recipes using session pool"""

    async def execute_prompt(
        self,
        bundle_name: str,
        prompt: str,
        user_id: str,
        execution_id: str
    ) -> str:
        """Execute a simple prompt with a bundle"""

        # Track execution start
        await track_event("execution_started", {
            "execution_id": execution_id,
            "user_id": user_id,
            "type": "prompt",
            "bundle": bundle_name
        })

        # Acquire session from pool
        session, session_id = await session_pool.acquire()

        try:
            # Stream updates via WebSocket
            await self._emit(execution_id, {
                "type": "execution:start",
                "prompt": prompt
            })

            # Execute
            result = await session.execute(prompt)

            # Stream result
            await self._emit(execution_id, {
                "type": "execution:complete",
                "result": result
            })

            # Track completion
            await track_event("execution_completed", {
                "execution_id": execution_id,
                "user_id": user_id,
                "success": True
            })

            return result

        except Exception as e:
            # Track error
            await track_event("execution_failed", {
                "execution_id": execution_id,
                "user_id": user_id,
                "error": str(e)
            })

            await self._emit(execution_id, {
                "type": "execution:error",
                "error": str(e)
            })

            raise

        finally:
            # Return session to pool
            await session_pool.release(session_id)

    async def execute_recipe(
        self,
        recipe_yaml: str,
        inputs: dict,
        user_id: str,
        execution_id: str
    ) -> dict:
        """Execute a recipe using session pool"""

        await track_event("recipe_execution_started", {
            "execution_id": execution_id,
            "user_id": user_id
        })

        session, session_id = await session_pool.acquire()

        try:
            # Parse recipe (Developer/Expert feature)
            from amplifier_recipes import Recipe
            recipe = Recipe.from_yaml(recipe_yaml)

            # Execute each step
            context = inputs.copy()

            for step in recipe.steps:
                await self._emit(execution_id, {
                    "type": "step:start",
                    "step_id": step.id
                })

                # Track each step
                await track_event("recipe_step_started", {
                    "execution_id": execution_id,
                    "step_id": step.id,
                    "agent": step.agent
                })

                # Execute step
                prompt = self._substitute_vars(step.prompt, context)
                result = await session.execute(
                    prompt,
                    agent=step.agent
                )

                # Update context
                if step.output:
                    context[step.output] = result

                await self._emit(execution_id, {
                    "type": "step:complete",
                    "step_id": step.id,
                    "output": result
                })

                await track_event("recipe_step_completed", {
                    "execution_id": execution_id,
                    "step_id": step.id
                })

            await self._emit(execution_id, {
                "type": "execution:complete",
                "outputs": context
            })

            await track_event("recipe_execution_completed", {
                "execution_id": execution_id,
                "step_count": len(recipe.steps)
            })

            return context

        except Exception as e:
            await track_event("recipe_execution_failed", {
                "execution_id": execution_id,
                "error": str(e)
            })
            raise

        finally:
            await session_pool.release(session_id)
```

---

## Analytics & Event Tracking

### Event Strategy

**Track EVERYTHING** to understand user behavior and improve the product:

**Events to Track:**
- Navigation: `page_view`, `tab_switched`, `mode_switched`
- Gallery: `gallery_searched`, `gallery_filtered`, `gallery_item_viewed`, `gallery_item_run`
- Execution: `execution_started`, `execution_step_started`, `execution_completed`, `execution_failed`
- Creation: `recipe_builder_opened`, `recipe_step_added`, `recipe_validated`, `recipe_exported`
- Skills: `skill_creator_opened`, `skill_validated`, `skill_exported` (Expert only)
- Auth: `github_auth_started`, `github_auth_completed`
- Errors: `error_occurred`, `rate_limit_hit`, `session_pool_exhausted`

### Implementation

```python
# app/core/analytics.py
from applicationinsights import TelemetryClient

telemetry = TelemetryClient(settings.INSIGHTS_KEY)

async def track_event(
    event_name: str,
    properties: dict = None,
    user_id: str = None
):
    """Track an event to Application Insights"""
    props = {
        "timestamp": datetime.utcnow().isoformat(),
        "environment": settings.ENVIRONMENT,
        **(properties or {})
    }

    if user_id:
        props["user_id"] = user_id

    telemetry.track_event(event_name, properties=props)
    telemetry.flush()

# Usage
await track_event("execution_started", {
    "type": "recipe",
    "recipe_name": recipe.name,
    "mode": user.mode
}, user_id=user.id)
```

### Frontend Tracking

```typescript
// useAnalytics hook
export function useAnalytics() {
  const trackEvent = (name: string, props?: Record<string, any>) => {
    appInsights.trackEvent({ name }, props);

    // Also send to backend
    fetch('/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify({ event: name, properties: props })
    });
  };

  return { trackEvent };
}

// Usage
const { trackEvent } = useAnalytics();
trackEvent('gallery_item_viewed', { itemType: 'recipe', itemId: id });
```

---

## Rate Limiting

### Strategy

**Rate limits by mode (per hour):**
- Normie: 20 executions
- Explorer: 40 executions
- Developer: 100 executions
- Expert: 200 executions

### Implementation

```python
# app/core/rate_limiter.py
class RateLimiter:
    """PostgreSQL-based rate limiting"""

    async def check_limit(self, user_id: str, mode: str) -> tuple[bool, int]:
        """Check if user is within rate limit"""
        limits = {
            "normie": 20,
            "explorer": 40,
            "developer": 100,
            "expert": 200
        }

        limit = limits.get(mode, 20)
        one_hour_ago = datetime.utcnow() - timedelta(hours=1)

        # Count recent executions
        count = await db.fetchval(
            "SELECT COUNT(*) FROM execution_log "
            "WHERE user_id = $1 AND created_at > $2",
            user_id, one_hour_ago
        )

        remaining = max(0, limit - count)
        allowed = count < limit

        return allowed, remaining
```

---

## API Endpoints

### Authentication

```python
@router.post("/api/auth/github")
async def github_oauth_callback(code: str):
    """Handle GitHub OAuth callback"""
    # Exchange code for access token
    github_user = await get_github_user(code)

    # Create JWT with mode
    token = create_jwt({
        "user_id": github_user.id,
        "username": github_user.login,
        "mode": "developer"  # Default mode
    })

    await track_event("github_auth_completed", {
        "user_id": github_user.id
    })

    return {"token": token, "user": github_user}
```

### Execution

```python
@router.post("/api/execute")
async def execute(
    request: ExecutionRequest,
    current_user = Depends(get_current_user)
):
    """Execute a bundle prompt or recipe"""

    # Check rate limit
    allowed, remaining = await rate_limiter.check_limit(
        current_user.id,
        current_user.mode
    )

    if not allowed:
        await track_event("rate_limit_hit", {
            "user_id": current_user.id
        })
        raise HTTPException(429, "Rate limit exceeded")

    # Generate execution ID
    execution_id = str(uuid.uuid4())

    # Execute based on type
    if request.type == "prompt":
        result = await executor.execute_prompt(
            bundle_name=request.bundle,
            prompt=request.prompt,
            user_id=current_user.id,
            execution_id=execution_id
        )
    elif request.type == "recipe":
        result = await executor.execute_recipe(
            recipe_yaml=request.recipe_yaml,
            inputs=request.inputs,
            user_id=current_user.id,
            execution_id=execution_id
        )

    # Log execution
    await db.execute(
        "INSERT INTO execution_log (user_id, execution_type) VALUES ($1, $2)",
        current_user.id, request.type
    )

    return {
        "execution_id": execution_id,
        "stream_url": f"/ws/stream/{execution_id}",
        "rate_limit_remaining": remaining - 1
    }
```

### Validation

```python
@router.post("/api/validate")
async def validate(
    request: ValidationRequest,
    current_user = Depends(get_current_user)
):
    """Validate recipe or bundle YAML"""

    if request.type == "recipe":
        from amplifier_recipes import Recipe
        try:
            recipe = Recipe.from_yaml(request.yaml)
            return {"valid": True, "recipe": recipe.to_dict()}
        except ValidationError as e:
            return {"valid": False, "errors": str(e)}

    elif request.type == "bundle":
        from amplifier_foundation import Bundle
        try:
            bundle = Bundle.from_yaml_string(request.yaml)
            return {"valid": True, "bundle": bundle.to_dict()}
        except ValidationError as e:
            return {"valid": False, "errors": str(e)}
```

### Gallery

```python
@router.get("/api/gallery")
async def get_gallery(
    type: str = None,  # recipe, bundle, skill
    category: str = None,
    mode: str = None
):
    """Get gallery items (pre-built content)"""

    query = "SELECT * FROM gallery_items WHERE 1=1"
    params = []

    if type:
        params.append(type)
        query += f" AND type = ${len(params)}"

    if category:
        params.append(category)
        query += f" AND category = ${len(params)}"

    if mode:
        # Filter by minimum mode required
        params.append(mode)
        query += f" AND min_mode <= ${len(params)}"

    query += " ORDER BY featured DESC, created_at DESC"

    items = await db.fetch(query, *params)

    return {"items": items}
```

---

## Recipe Execution

```python
@router.post("/api/recipes/execute")
async def execute_recipe(
    request: RecipeExecutionRequest,
    current_user = Depends(get_current_user)
):
    """Execute a recipe asynchronously"""

    # Rate limiting
    if not await rate_limiter.check(current_user.id):
        raise HTTPException(429, "Rate limit exceeded")

    # Validate recipe YAML
    try:
        recipe = Recipe.from_yaml(request.recipe_yaml)
    except ValidationError as e:
        raise HTTPException(400, f"Invalid recipe: {e}")

    # Create session
    session = await session_service.create(
        user_id=current_user.id,
        recipe_yaml=request.recipe_yaml,
        inputs=request.inputs,
        mode=current_user.mode
    )

    # Queue for execution
    await execution_queue.enqueue(
        executor=recipe_executor.execute,
        recipe_yaml=request.recipe_yaml,
        inputs=request.inputs,
        session_id=session.id,
        user_id=current_user.id
    )

    return {
        "session_id": session.id,
        "status": "queued",
        "stream_url": f"/ws/stream/{session.id}"
    }
```

#### Gallery Management

```python
@router.get("/api/gallery/recipes")
async def list_recipes(
    category: str = None,
    mode: str = None,
    sort: str = "popular",
    limit: int = 20,
    offset: int = 0
):
    """List recipes from community gallery"""

    recipes = await gallery_service.list_recipes(
        category=category,
        mode=mode,
        sort=sort,
        limit=limit,
        offset=offset
    )

    return {
        "recipes": recipes,
        "total": await gallery_service.count_recipes(category, mode),
        "offset": offset,
        "limit": limit
    }

@router.post("/api/gallery/recipes")
async def publish_recipe(
    recipe: RecipePublishRequest,
    current_user = Depends(get_current_user)
):
    """Publish recipe to community gallery"""

    # Validate recipe
    validated = await recipe_validator.validate(recipe.yaml)

    # Create gallery entry
    entry = await gallery_service.create_recipe(
        user_id=current_user.id,
        name=recipe.name,
        description=recipe.description,
        yaml=recipe.yaml,
        category=recipe.category,
        mode=recipe.mode,
        tags=recipe.tags
    )

    return entry
```

### Deployment (Azure Container Apps)

**Configuration:**
```yaml
# container-app.yaml
properties:
  configuration:
    ingress:
      external: true
      targetPort: 8000
      transport: auto  # HTTP/2 and WebSocket support

    secrets:
      - name: database-url
        value: postgresql://...
      - name: anthropic-api-key
        keyVaultUrl: https://keyvault.../secrets/anthropic-key

  template:
    containers:
      - name: api
        image: amplifierapi.azurecr.io/api:latest
        resources:
          cpu: 2.0
          memory: 4Gi
        env:
          - name: DATABASE_URL
            secretRef: database-url
          - name: ANTHROPIC_API_KEY
            secretRef: anthropic-api-key

    scale:
      minReplicas: 2
      maxReplicas: 10
      rules:
        - name: http-scaling
          http:
            metadata:
              concurrentRequests: "50"
```

**Container Image Build:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY app/ ./app/

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8000/health || exit 1

# Run
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## Data Architecture

### PostgreSQL Schema (Minimal)

```sql
-- Rate limiting only (no user data persistence)
CREATE TABLE execution_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,  -- GitHub user ID
    execution_type VARCHAR(50),      -- 'prompt' or 'recipe'
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_execution_user_created ON execution_log(user_id, created_at);

-- Static gallery content (pre-built recipes/bundles/skills)
CREATE TABLE gallery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL,      -- 'recipe', 'bundle', 'skill'
    name VARCHAR(255) NOT NULL,
    description TEXT,
    yaml TEXT NOT NULL,
    category VARCHAR(100),
    min_mode VARCHAR(50),           -- Minimum mode required (normie, explorer, developer, expert)
    featured BOOLEAN DEFAULT false,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_gallery_type ON gallery_items(type);
CREATE INDEX idx_gallery_category ON gallery_items(category);
CREATE INDEX idx_gallery_featured ON gallery_items(featured);

-- That's it! Just 2 tables.
```

**What we DON'T store:**
- ❌ User accounts/profiles
- ❌ User sessions
- ❌ User-created recipes/bundles
- ❌ Execution history/results
- ❌ User workspaces

**What users DO:**
- ✅ Download/export creations locally
- ✅ Copy YAML to clipboard
- ✅ Export skills as Python modules

---

## Security Architecture

### Authentication

**Azure AD B2C:**
- GitHub OAuth login
- Email/password
- JWT tokens
- Refresh tokens

**Implementation:**
```python
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def get_current_user(
    token: str = Depends(security)
) -> User:
    """Validate JWT and return user"""
    try:
        payload = jwt.decode(
            token.credentials,
            settings.JWT_SECRET,
            algorithms=["HS256"]
        )
        user_id = payload.get("sub")
        user = await user_service.get(user_id)
        if not user:
            raise HTTPException(401, "Invalid token")
        return user
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")
```

### Authorization

**Mode-Based Access Control:**
```python
def require_mode(minimum_mode: str):
    """Decorator to require specific user mode"""
    def decorator(func):
        async def wrapper(
            *args,
            current_user: User = Depends(get_current_user),
            **kwargs
        ):
            mode_hierarchy = ["normie", "explorer", "developer", "expert"]
            user_level = mode_hierarchy.index(current_user.mode)
            required_level = mode_hierarchy.index(minimum_mode)

            if user_level < required_level:
                raise HTTPException(
                    403,
                    f"This feature requires {minimum_mode} mode"
                )

            return await func(*args, current_user=current_user, **kwargs)
        return wrapper
    return decorator

# Usage
@router.post("/api/skills/create")
@require_mode("expert")
async def create_skill(
    skill: SkillCreateRequest,
    current_user: User = Depends(get_current_user)
):
    ...
```

### Sandboxing

**Security Measures:**
1. **Container Isolation:** Each execution in separate container
2. **Resource Limits:** CPU, memory, disk, network limits
3. **No Network:** Containers can't make external requests (unless explicitly enabled)
4. **Read-Only Filesystem:** Base filesystem is immutable
5. **Capability Dropping:** All Linux capabilities dropped
6. **Timeout Enforcement:** Hard 10-minute timeout
7. **Log Sanitization:** Remove sensitive data before storage

### Rate Limiting

```python
class RateLimiter:
    """Rate limit per user"""

    async def check(self, user_id: str) -> bool:
        """Check if user is within rate limit"""

        key = f"ratelimit:{user_id}:{self._current_minute()}"
        count = await redis.incr(key)

        if count == 1:
            # First request this minute, set TTL
            await redis.expire(key, 60)

        # Limits by mode
        limits = {
            "normie": 10,      # 10 executions/minute
            "explorer": 20,
            "developer": 50,
            "expert": 100
        }

        user = await user_service.get(user_id)
        limit = limits.get(user.mode, 10)

        return count <= limit
```

---

## Performance & Scalability

### Caching Strategy

**Application Layer:**
- Gallery recipes cached for 5 minutes
- User sessions cached for 1 hour
- Static content (Learn pages) cached for 24 hours

**CDN Layer (Azure CDN):**
- Static assets cached globally
- Homepage cached for 1 hour
- Gallery listings cached for 5 minutes

### Database Optimization

**Indexes:**
- All foreign keys indexed
- Query-specific composite indexes
- Full-text search on recipe names/descriptions

**Connection Pooling:**
```python
engine = create_async_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=10,
    pool_pre_ping=True
)
```

### Scaling Strategy

**Horizontal Scaling:**
- Container Apps auto-scale based on CPU/request count
- Min 2 replicas, max 10 replicas
- Scale up at 70% CPU or 50 concurrent requests

**Vertical Scaling:**
- Start: 2 CPU, 4GB RAM per container
- Can increase to 4 CPU, 8GB RAM if needed

**Database:**
- Azure PostgreSQL Flexible Server
- Can scale compute tier independently
- Read replicas for heavy read operations

---

## Monitoring & Observability

### Application Insights

**Tracked Metrics:**
- Request latency (p50, p95, p99)
- Error rate
- Execution success rate
- WebSocket connection count
- Queue depth

**Custom Events:**
```python
from applicationinsights import TelemetryClient

telemetry = TelemetryClient(settings.INSIGHTS_KEY)

# Track recipe execution
telemetry.track_event(
    "recipe_execution",
    properties={
        "recipe_id": recipe_id,
        "user_mode": user.mode,
        "duration_seconds": duration
    },
    measurements={
        "step_count": len(recipe.steps)
    }
)
```

### Health Checks

```python
@router.get("/health")
async def health_check():
    """Health check endpoint"""

    checks = {
        "api": "ok",
        "database": await check_database(),
        "redis": await check_redis(),
        "blob": await check_blob_storage()
    }

    all_ok = all(v == "ok" for v in checks.values())
    status_code = 200 if all_ok else 503

    return JSONResponse(
        content=checks,
        status_code=status_code
    )
```

### Logging

**Structured Logging:**
```python
import structlog

logger = structlog.get_logger()

# Usage
logger.info(
    "recipe_execution_started",
    session_id=session_id,
    recipe_id=recipe_id,
    user_id=user_id,
    mode=user.mode
)
```

---

## Deployment & CI/CD

### Separate Pipelines

**Frontend (`.github/workflows/frontend.yml`):**
```yaml
name: Deploy Frontend
on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'
      - '.github/workflows/frontend.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
        working-directory: frontend
      - run: npm run build
        working-directory: frontend
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
          NEXT_PUBLIC_GITHUB_CLIENT_ID: ${{ secrets.GITHUB_CLIENT_ID }}
      - uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_SWA_TOKEN }}
          app_location: "frontend"
```

**Backend (`.github/workflows/backend.yml`):**
```yaml
name: Deploy Backend
on:
  push:
    branches: [main]
    paths:
      - 'backend/**'
      - '.github/workflows/backend.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/login-action@v2
        with:
          registry: amplifierapi.azurecr.io
          username: ${{ secrets.ACR_USERNAME }}
          password: ${{ secrets.ACR_PASSWORD }}
      - uses: docker/build-push-action@v4
        with:
          context: ./backend
          push: true
          tags: amplifierapi.azurecr.io/api:latest
      - uses: azure/container-apps-deploy-action@v1
        with:
          containerAppName: amplifier-api
          resourceGroup: amplifier-rg
          imageToDeploy: amplifierapi.azurecr.io/api:latest
```

---

## Cost Estimation (Azure)

### Monthly Infrastructure Costs (Simplified)

**Compute:**
- Azure Container Apps (2 instances, 2 CPU, 4GB): ~$150/month
- Pre-warmed sessions (in-process, no extra cost)

**Storage:**
- Azure Database for PostgreSQL (Basic tier): ~$40/month (minimal data)
- No Blob Storage needed
- No Redis needed

**Networking:**
- Azure CDN: ~$20/month
- Bandwidth: ~$20/month

**Monitoring:**
- Azure Application Insights: ~$50/month (event-heavy tracking)

**Total Infrastructure: ~$280/month**

**LLM API Costs (Anthropic):**
- Estimate: $0.30-0.50 per execution
- 10,000 executions/month = $3,000-5,000/month

**Total: ~$3,300-5,300/month at moderate usage**

### Scaling Costs

At 100,000 executions/month:
- Infrastructure scales to ~$600/month
- LLM costs scale to ~$30,000-50,000/month
- **Total: ~$31,000-51,000/month**

**Cost savings from simplification:** ~$100/month vs. original architecture

---

## Development Workflow

### Local Development

```bash
# Start dependencies
docker-compose up -d postgres redis

# Run backend
cd backend
uvicorn app.main:app --reload

# Run frontend
cd frontend
npm run dev
```

### CI/CD Pipeline

**GitHub Actions:**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_SWA_TOKEN }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/build-push-action@v4
        with:
          context: ./backend
          push: true
          tags: amplifierapi.azurecr.io/api:latest
      - uses: Azure/container-apps-deploy-action@v1
        with:
          containerAppName: amplifier-api
          resourceGroup: amplifier-rg
          imageToDeploy: amplifierapi.azurecr.io/api:latest
```

---

## Open Questions

1. **LLM Provider Strategy:** Anthropic only or multi-provider from start?
2. **Execution Timeout:** 10 minutes sufficient or need longer for complex recipes?
3. **Storage Retention:** How long to keep execution logs?
4. **Custom Domains:** Support user custom domains for shared content?
5. **Enterprise Features:** Multi-tenant support from start or later?

---

## Next Steps

1. **Prototype:** Build minimal execution sandbox proof-of-concept
2. **Performance Testing:** Validate container startup times acceptable
3. **Cost Modeling:** Refine cost estimates with real execution profiles
4. **Security Audit:** External review of sandboxing approach
5. **Infrastructure Setup:** Provision Azure resources
