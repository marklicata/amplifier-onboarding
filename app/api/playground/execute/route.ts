import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { config } from 'dotenv';

// Load environment variables
config({ path: path.join(process.cwd(), '.env') });

const execAsync = promisify(exec);

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 second timeout for longer examples

interface ExecuteRequest {
  exampleId: string;
  inputs?: Record<string, any>;
  mode?: string;
}

interface ExecuteResponse {
  success: boolean;
  output: string;
  executionTimeMs: number;
  metadata?: any;
  error?: string;
}

/**
 * POST /api/playground/execute
 * Executes an amplifier-foundation example
 */
export async function POST(request: Request) {
  try {
    const body: ExecuteRequest = await request.json();
    const { exampleId, inputs = {}, mode = 'normie' } = body;

    if (!exampleId) {
      return NextResponse.json(
        { error: 'Example ID is required' },
        { status: 400 }
      );
    }

    // Path to Python execution script
    const scriptPath = path.join(process.cwd(), 'lib', 'run-example.py');

    // Prepare arguments as JSON
    const args = JSON.stringify({ exampleId, inputs, mode });

    console.log(`Executing example: ${exampleId} (mode: ${mode})`);
    
    const startTime = Date.now();
    // Try python3 first (Linux/WSL), fallback to python (Windows)
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';

    // Use spawn with stdin instead of passing JSON as argument (cross-platform safe)
    const { spawn } = require('child_process');
    
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
      metadata: pythonResult.metadata,
    });

  } catch (error: any) {
    console.error('Execute API error:', error);

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
    let errorMessage = 'Failed to execute example';
    if (error.message.includes('timeout')) {
      errorMessage = 'Example took too long to execute (timeout after 60s)';
    } else if (error.message.includes('ENOENT')) {
      errorMessage = 'Example execution script not found';
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
 * GET /api/playground/execute
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'amplifier-playground-execute',
    timestamp: new Date().toISOString(),
  });
}
