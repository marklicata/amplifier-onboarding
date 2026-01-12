import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

/**
 * GET /api/playground/examples
 * Returns list of all available examples
 */
export async function GET() {
  try {
    const examplesPath = path.join(process.cwd(), 'public', 'examples', 'index.json');
    
    if (!fs.existsSync(examplesPath)) {
      return NextResponse.json(
        { error: 'Examples index not found' },
        { status: 404 }
      );
    }
    
    const data = fs.readFileSync(examplesPath, 'utf-8');
    const examples = JSON.parse(data);
    
    return NextResponse.json(examples);
    
  } catch (error: any) {
    console.error('Failed to load examples:', error);
    return NextResponse.json(
      { 
        error: 'Failed to load examples',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
