import { NextRequest } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export const dynamic = 'force-dynamic';

interface ConfigData {
  provider: string;
  apiKey: string;
  model: string;
  tools: string[];
  orchestrator: string;
  context: string;
  hooks: string[];
  instructions: string;
}

interface SaveConfigRequest {
  config: ConfigData;
  bundle: any;
}

// In-memory storage for user config_ids (maps user_id -> config_id from amplifier-app-api)
const userConfigIds = new Map<string, string>();

// In-memory cache of user configs for display purposes
const userConfigs = new Map<string, ConfigData>();

export async function GET(request: NextRequest) {
  try {
    // Get user ID from header
    const userId = request.headers.get('x-user-id') || 'anonymous';

    // Retrieve user's cached config
    const config = userConfigs.get(userId);

    if (!config) {
      // Return default config
      return Response.json({
        config: {
          provider: 'anthropic',
          apiKey: '',
          model: 'claude-sonnet-4-5',
          tools: ['tool-web'],
          orchestrator: 'loop-basic',
          context: 'context-simple',
          hooks: [],
          instructions: `You are a helpful AI assistant powered by Amplifier, a modular AI agent framework.

Your role is to answer questions about Amplifier - its architecture, capabilities, and how to use it effectively.

Key topics you can help with:
- Amplifier's modular architecture (kernel, modules, bundles)
- How to create and configure bundles
- Available modules (providers, tools, orchestrators, context managers, hooks)
- Best practices for building AI applications with Amplifier
- Troubleshooting and debugging Amplifier applications

Be clear, concise, and helpful in your responses. Use examples when appropriate.`,
        },
      });
    }

    return Response.json({ config });
  } catch (error: any) {
    console.error('Config GET error:', error);
    return Response.json(
      { error: 'Failed to load configuration', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user ID from header
    const userId = request.headers.get('x-user-id') || 'anonymous';

    const body: SaveConfigRequest = await request.json();
    const { config, bundle } = body;

    if (!config || !bundle) {
      return Response.json(
        { error: 'Missing config or bundle in request' },
        { status: 400 }
      );
    }

    console.log(`Saving config for user: ${userId}`);

    // Save the bundle JSON to a temporary file
    const tempDir = path.join(process.cwd(), '.temp');
    const fs = require('fs');
    
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const bundleFileName = `user-bundle-${userId}-${Date.now()}.json`;
    const bundlePath = path.join(tempDir, bundleFileName);
    
    fs.writeFileSync(bundlePath, JSON.stringify(bundle, null, 2), 'utf-8');

    console.log(`Bundle written to: ${bundlePath}`);

    // Call Python script to create config via amplifier-app-api
    const scriptPath = path.join(process.cwd(), 'lib', 'amplifier', 'python', 'create-config.py');
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
    
    // Escape the paths for shell
    const escapedScriptPath = scriptPath.replace(/"/g, '\\"');
    const escapedBundlePath = bundlePath.replace(/"/g, '\\"');
    const escapedUserId = userId.replace(/"/g, '\\"');
    
    const command = `${pythonCmd} "${escapedScriptPath}" "${escapedBundlePath}" "${escapedUserId}"`;

    console.log('Executing config creation command...');
    
    try {
      const { stdout, stderr } = await execAsync(command, {
        timeout: 30000,
        maxBuffer: 1024 * 1024,
        env: { ...process.env },
      });

      if (stderr) {
        console.error('Python stderr:', stderr);
      }

      console.log('Python stdout:', stdout);

      // Parse the response
      const result = JSON.parse(stdout);

      if (result.error) {
        throw new Error(result.error);
      }

      // Store the config_id for this user
      if (result.config_id) {
        userConfigIds.set(userId, result.config_id);
        console.log(`Config ID stored for user ${userId}: ${result.config_id}`);
      }

      // Cache the config for display
      userConfigs.set(userId, config);

      // Clean up temp file
      try {
        fs.unlinkSync(bundlePath);
      } catch (cleanupError) {
        console.warn('Failed to clean up temp file:', cleanupError);
      }

      return Response.json({
        success: true,
        message: 'Configuration saved successfully',
        config_id: result.config_id,
      });
    } catch (execError: any) {
      console.error('Failed to execute config creation:', execError);
      
      // Clean up temp file on error
      try {
        if (fs.existsSync(bundlePath)) {
          fs.unlinkSync(bundlePath);
        }
      } catch (cleanupError) {
        console.warn('Failed to clean up temp file:', cleanupError);
      }

      // For now, fall back to in-memory storage if API call fails
      console.log('Falling back to in-memory storage');
      userConfigs.set(userId, config);
      
      return Response.json({
        success: true,
        message: 'Configuration saved (in-memory fallback)',
        warning: 'Could not connect to amplifier-app-api',
      });
    }
  } catch (error: any) {
    console.error('Config POST error:', error);
    return Response.json(
      { error: 'Failed to save configuration', details: error.message },
      { status: 500 }
    );
  }
}
