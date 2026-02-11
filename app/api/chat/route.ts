import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { config } from 'dotenv';

// Load environment variables from .env file
config({ path: path.join(process.cwd(), '.env') });

const execAsync = promisify(exec);

export const dynamic = 'force-dynamic';

interface ChatRequest {
  message: string;
  sessionId?: string;
  userId?: string;  // Anonymous ID or authenticated user ID
}

interface ChatResponse {
  response: string;
  session_id?: string;
  timestamp: string;
  error?: string;
}

export async function POST(request: Request) {
  try {
    const body: ChatRequest = await request.json();
    const { message, sessionId, userId } = body;

    if (!message || !message.trim()) {
      return Response.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Path to Python script
    const scriptPath = path.join(process.cwd(), 'lib', 'amplifier', 'python', 'amplifier-chat.py');

    // Escape inputs for shell safety
    const escapedMessage = message.replace(/"/g, '\\"');
    const escapedSessionId = sessionId ? sessionId.replace(/"/g, '\\"') : '';
    const escapedUserId = userId ? userId.replace(/"/g, '\\"') : 'anonymous';

    console.log(`Chat request - sessionId: ${sessionId || 'none'}, userId: ${userId || 'anonymous'}`);

    // Use correct Python command based on platform
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
    const command = `${pythonCmd} "${scriptPath}" "${escapedMessage}" "${escapedSessionId}" "${escapedUserId}"`;

    console.log('Executing chat command...');
    const { stdout, stderr } = await execAsync(command, {
      timeout: 30000, // 30 second timeout
      maxBuffer: 1024 * 1024, // 1MB buffer
      env: { ...process.env }, // Pass all environment variables to Python
    });

    if (stderr) {
      console.error('Python stderr:', stderr);
    }

    console.log('Python stdout:', stdout); // Debug: see what Python returned

    // Parse JSON response from Python
    const result: ChatResponse = JSON.parse(stdout);

    if (result.error) {
      return Response.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Return response with session_id so frontend can maintain session
    console.log(`Chat response - sessionId: ${result.session_id}`);
    return Response.json(result);

  } catch (error: any) {
    console.error('Chat API error:', error);

    // Try to parse error output as JSON
    if (error.stdout) {
      try {
        const errorData = JSON.parse(error.stdout);
        return Response.json(
          { error: errorData.error || 'Unknown error' },
          { status: 500 }
        );
      } catch {
        // Not JSON, fall through
      }
    }

    return Response.json(
      {
        error: 'Failed to process chat request',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return Response.json({
    status: 'ok',
    service: 'amplifier-chat-api',
    timestamp: new Date().toISOString()
  });
}
