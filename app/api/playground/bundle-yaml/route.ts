import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

/**
 * GET /api/playground/bundle-yaml?path=<bundlePath>
 * Fetches the YAML content of a bundle
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bundlePath = searchParams.get('path');

    if (!bundlePath) {
      return NextResponse.json(
        { success: false, error: 'Bundle path is required' },
        { status: 400 }
      );
    }

    // Security: only allow reading from bundles directory
    if (bundlePath.includes('..') || bundlePath.includes('\\..') || bundlePath.includes('/..')) {
      return NextResponse.json(
        { success: false, error: 'Invalid bundle path' },
        { status: 400 }
      );
    }

    // Construct full path to bundle
    const fullPath = path.join(process.cwd(), 'lib', 'amplifier', 'bundles', bundlePath);

    // Read the YAML file
    try {
      const yamlContent = await fs.readFile(fullPath, 'utf-8');
      
      return NextResponse.json({
        success: true,
        yaml: yamlContent,
        path: bundlePath,
      });
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return NextResponse.json(
          { success: false, error: 'Bundle file not found' },
          { status: 404 }
        );
      }
      throw error;
    }

  } catch (error: any) {
    console.error('Bundle YAML fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch bundle YAML',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
