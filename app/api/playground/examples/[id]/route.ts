import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

/**
 * GET /api/playground/examples/[id]
 * Returns detailed information about a specific example
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Example ID is required' },
        { status: 400 }
      );
    }
    
    const examplePath = path.join(process.cwd(), 'public', 'examples', `${id}.json`);
    
    if (!fs.existsSync(examplePath)) {
      return NextResponse.json(
        { error: 'Example not found', id },
        { status: 404 }
      );
    }
    
    const data = fs.readFileSync(examplePath, 'utf-8');
    const example = JSON.parse(data);
    
    return NextResponse.json(example);
    
  } catch (error: any) {
    console.error('Failed to load example:', error);
    return NextResponse.json(
      { 
        error: 'Failed to load example',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
