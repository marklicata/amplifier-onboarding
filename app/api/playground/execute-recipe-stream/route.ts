import { NextRequest } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import { config } from 'dotenv';

// Load environment variables
config({ path: path.join(process.cwd(), '.env') });

export const dynamic = 'force-dynamic';
export const maxDuration = 120; // Recipes can take longer than bundles

interface ExecuteRecipeStreamRequest {
  recipeId: string;
  recipePath: string;
  inputs: Record<string, string>;
}

/**
 * POST /api/playground/execute-recipe-stream
 * Streaming execution endpoint for recipes using Server-Sent Events
 */
export async function POST(request: NextRequest) {
  try {
    const body: ExecuteRecipeStreamRequest = await request.json();
    const { recipeId, recipePath, inputs } = body;

    if (!recipeId || !recipePath) {
      return new Response('recipeId and recipePath are required', { status: 400 });
    }

    // Create a readable stream
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let isClosed = false;

        // Helper to send SSE events
        const sendEvent = (event: string, data: any) => {
          if (isClosed) return; // Don't send if controller already closed
          try {
            const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
            controller.enqueue(encoder.encode(message));
          } catch (error) {
            // Controller closed, mark as closed to prevent further attempts
            isClosed = true;
          }
        };

        // Send initial status
        sendEvent('status', { phase: 'starting', message: 'Initializing recipe execution...' });

        const scriptPath = path.join(process.cwd(), 'lib', 'amplifier', 'python', 'run-recipe-stream.py');
        const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';

        // Prepare arguments
        const args = JSON.stringify({
          recipeId,
          recipePath,
          inputs
        });

        const proc = spawn(pythonCmd, [scriptPath], {
          env: { ...process.env },
        });

        let errorBuffer = '';
        let startTime = Date.now();

        // Cleanup function for connection close
        const cleanup = () => {
          if (!isClosed) {
            isClosed = true;
            // Kill Python process if still running
            if (!proc.killed) {
              proc.kill('SIGTERM');
            }
          }
        };

        // Handle client disconnect
        request.signal.addEventListener('abort', () => {
          console.log('Client disconnected, cleaning up recipe execution');
          cleanup();
        });

        proc.stdout.on('data', (data: Buffer) => {
          const chunk = data.toString();

          // Parse streaming events from Python
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.trim().startsWith('STREAM:')) {
              // Python sends: STREAM:{"type":"step_start","step":1,...}
              try {
                const streamData = JSON.parse(line.substring(7));
                
                // Forward events to frontend
                if (streamData.type === 'step_start') {
                  sendEvent('step_start', {
                    step: streamData.step,
                    stepName: streamData.stepName,
                    bundleId: streamData.bundleId,
                    totalSteps: streamData.totalSteps
                  });
                } else if (streamData.type === 'chunk') {
                  sendEvent('chunk', { content: streamData.content });
                } else if (streamData.type === 'step_complete') {
                  sendEvent('step_complete', {
                    step: streamData.step,
                    stepName: streamData.stepName,
                    timing: streamData.timing,
                    output: streamData.output
                  });
                } else if (streamData.type === 'error') {
                  sendEvent('error', {
                    error: streamData.error,
                    step: streamData.step,
                    details: streamData.details
                  });
                }
              } catch (e) {
                console.error('Failed to parse stream event:', line);
              }
            }
          }
        });

        proc.stderr.on('data', (data: Buffer) => {
          errorBuffer += data.toString();
          const message = data.toString().trim();
          if (message && !message.startsWith('STREAM:')) {
            sendEvent('progress', { message });
          }
        });

        proc.on('close', (code: number) => {
          if (isClosed) return; // Already closed
          
          const executionTimeMs = Date.now() - startTime;

          if (code === 0) {
            sendEvent('complete', {
              executionTimeMs,
              message: 'Recipe execution completed successfully'
            });
          } else {
            sendEvent('error', {
              error: `Recipe execution failed with code ${code}`,
              details: errorBuffer,
              executionTimeMs
            });
          }

          isClosed = true;
          try {
            controller.close();
          } catch (e) {
            // Already closed, ignore
          }
        });

        proc.on('error', (error: Error) => {
          if (isClosed) return;
          
          sendEvent('error', {
            error: 'Failed to start Python process',
            details: error.message
          });
          
          isClosed = true;
          try {
            controller.close();
          } catch (e) {
            // Already closed, ignore
          }
        });

        // Write input to stdin
        proc.stdin.write(args);
        proc.stdin.end();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error('Execute recipe stream API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to start execution', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * GET /api/playground/execute-recipe-stream
 * Health check
 */
export async function GET() {
  return new Response(
    JSON.stringify({
      status: 'ok',
      service: 'amplifier-playground-execute-recipe-stream',
      timestamp: new Date().toISOString(),
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
