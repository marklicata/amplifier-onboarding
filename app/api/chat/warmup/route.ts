import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Path to Python warmup script
    const scriptPath = path.join(process.cwd(), 'lib', 'amplifier-warmup.py');

    console.log('Warming up Amplifier session...');
    const { stdout, stderr } = await execAsync(`python "${scriptPath}"`, {
      timeout: 30000, // 30 second timeout
      maxBuffer: 1024 * 1024, // 1MB buffer
    });

    if (stderr) {
      console.error('Python stderr:', stderr);
    }

    // Parse JSON response from Python
    const result = JSON.parse(stdout);

    if (result.error) {
      return Response.json(
        { error: result.error },
        { status: 500 }
      );
    }

    console.log('Amplifier session warmed up successfully');
    return Response.json(result);

  } catch (error: any) {
    console.error('Warmup API error:', error);

    return Response.json(
      {
        error: 'Failed to warm up session',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// GET endpoint for health check
export async function GET() {
  return Response.json({
    status: 'ok',
    service: 'amplifier-warmup-api',
    timestamp: new Date().toISOString()
  });
}
