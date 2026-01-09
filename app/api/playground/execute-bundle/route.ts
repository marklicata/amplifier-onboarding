import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import { config } from 'dotenv';

// Load environment variables
config({ path: path.join(process.cwd(), '.env') });

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 second timeout

interface ExecuteBundleRequest {
  bundleId: string;
  bundlePath: string;
  prompt: string;
}

interface ExecuteBundleResponse {
  success: boolean;
  output: string;
  executionTimeMs: number;
  error?: string;
}

/**
 * POST /api/playground/execute-bundle
 * Executes a prompt using a specified Amplifier bundle
 */
export async function POST(request: Request) {
  try {
    const body: ExecuteBundleRequest = await request.json();
    const { bundleId, bundlePath, prompt } = body;

    if (!bundleId || !bundlePath || !prompt) {
      return NextResponse.json(
        { error: 'bundleId, bundlePath, and prompt are required' },
        { status: 400 }
      );
    }

    // Path to Python execution script
    const scriptPath = path.join(process.cwd(), 'lib', 'run-bundle.py');

    // Prepare arguments as JSON
    const args = JSON.stringify({ bundleId, bundlePath, prompt });

    console.log(`Executing bundle: ${bundleId} with prompt: ${prompt.substring(0, 50)}...`);
    
    const startTime = Date.now();
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';

    // Use spawn with stdin for cross-platform JSON passing
    const result = await new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
      const proc = spawn(pythonCmd, [scriptPath], {
        env: { ...process.env },
        timeout: 60000,
      });

      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (data: Buffer) => {
        stdout += data.toString();
      });

      proc.stderr.on('data', (data: Buffer) => {
        stderr += data.toString();
      });

      proc.on('close', (code: number) => {
        if (code === 0) {
          resolve({ stdout, stderr });
        } else {
          reject(new Error(`Process exited with code ${code}: ${stderr}`));
        }
      });

      proc.on('error', (error: Error) => {
        reject(error);
      });

      // Write JSON to stdin
      proc.stdin.write(args);
      proc.stdin.end();
    });

    const { stdout, stderr } = result;

    if (stderr) {
      console.warn('Python stderr:', stderr);
    }

    const executionTimeMs = Date.now() - startTime;

    // Parse JSON response from Python
    const pythonResult = JSON.parse(stdout);

    if (pythonResult.error) {
      return NextResponse.json(
        {
          success: false,
          error: pythonResult.error,
          executionTimeMs,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      output: pythonResult.output,
      executionTimeMs,
    });

  } catch (error: any) {
    console.error('Execute bundle API error:', error);

    // Try to parse error output as JSON
    if (error.stdout) {
      try {
        const errorData = JSON.parse(error.stdout);
        return NextResponse.json(
          { 
            success: false, 
            error: errorData.error || 'Execution failed',
            details: errorData.traceback 
          },
          { status: 500 }
        );
      } catch {
        // Not JSON, fall through
      }
    }

    // Categorize common errors
    let errorMessage = 'Failed to execute bundle';
    if (error.message.includes('timeout')) {
      errorMessage = 'Bundle execution took too long (timeout after 60s)';
    } else if (error.message.includes('ENOENT')) {
      errorMessage = 'Bundle execution script not found';
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/playground/execute-bundle
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'amplifier-playground-execute-bundle',
    timestamp: new Date().toISOString(),
  });
}
