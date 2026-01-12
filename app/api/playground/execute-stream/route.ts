import { NextRequest } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import { config } from 'dotenv';

// Load environment variables
config({ path: path.join(process.cwd(), '.env') });

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface ExecuteStreamRequest {
  exampleId: string;
  inputs?: Record<string, any>;
  mode?: string;
}

/**
 * POST /api/playground/execute-stream
 * Streaming execution endpoint using Server-Sent Events
 */
export async function POST(request: NextRequest) {
  try {
    const body: ExecuteStreamRequest = await request.json();
    const { exampleId, inputs = {}, mode = 'developers' } = body;

    if (!exampleId) {
      return new Response('Example ID is required', { status: 400 });
    }

    // Create a readable stream
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        // Helper to send SSE events
        const sendEvent = (event: string, data: any) => {
          const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(message));
        };

        // Send initial status
        sendEvent('status', { phase: 'starting', message: 'Initializing execution...' });

        const scriptPath = path.join(process.cwd(), 'lib', 'run-example.py');
        const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';

        // Prepare arguments (streaming is always enabled)
        const args = JSON.stringify({
          exampleId,
          inputs,
          mode
        });

        const proc = spawn(pythonCmd, [scriptPath], {
          env: { ...process.env },
        });

        let outputBuffer = '';
        let errorBuffer = '';
        let startTime = Date.now();

        proc.stdout.on('data', (data: Buffer) => {
          const chunk = data.toString();

          // Try to parse streaming events from Python
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.trim().startsWith('STREAM:')) {
              // Python sends: STREAM:{"type":"chunk","content":"..."}
              try {
                const streamData = JSON.parse(line.substring(7));
                if (streamData.type === 'chunk') {
                  sendEvent('chunk', { content: streamData.content });
                } else if (streamData.type === 'step') {
                  sendEvent('step', { 
                    step: streamData.step,
                    status: streamData.status,
                    message: streamData.message
                  });
                }
              } catch (e) {
                // Not a stream event, might be regular output
              }
            } else if (line.trim() && !line.trim().startsWith('STREAM:')) {
              // Only add non-STREAM lines to output buffer
              outputBuffer += line + '\n';
            }
          }
        });

        proc.stderr.on('data', (data: Buffer) => {
          errorBuffer += data.toString();
          // Send progress updates from stderr
          const message = data.toString().trim();
          if (message) {
            sendEvent('progress', { message });
          }
        });

        proc.on('close', (code: number) => {
          const executionTimeMs = Date.now() - startTime;

          if (code === 0) {
            // Try to parse final result
            try {
              const trimmedOutput = outputBuffer.trim();
              const result = JSON.parse(trimmedOutput);
              
              if (result.error) {
                sendEvent('error', { 
                  error: result.error,
                  details: result.traceback,
                  executionTimeMs
                });
              } else {
                sendEvent('complete', {
                  output: result.output,
                  metadata: result.metadata,
                  executionTimeMs
                });
              }
            } catch (e) {
              // Not JSON, send raw output
              const trimmedOutput = outputBuffer.trim();
              if (trimmedOutput) {
                sendEvent('complete', {
                  output: trimmedOutput,
                  executionTimeMs
                });
              } else {
                sendEvent('complete', {
                  output: 'Execution completed (no output)',
                  executionTimeMs
                });
              }
            }
          } else {
            sendEvent('error', {
              error: `Process exited with code ${code}`,
              details: errorBuffer,
              executionTimeMs
            });
          }

          controller.close();
        });

        proc.on('error', (error: Error) => {
          sendEvent('error', {
            error: 'Failed to start Python process',
            details: error.message
          });
          controller.close();
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
    console.error('Execute stream API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to start execution', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * GET /api/playground/execute-stream
 * Health check
 */
export async function GET() {
  return new Response(
    JSON.stringify({
      status: 'ok',
      service: 'amplifier-playground-execute-stream',
      timestamp: new Date().toISOString(),
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
