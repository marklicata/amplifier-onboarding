import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    // Get recipe path from query params
    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json(
        { success: false, error: 'Recipe path is required' },
        { status: 400 }
      );
    }

    // Construct full path to recipe file
    const recipePath = join(process.cwd(), 'lib', 'recipes', path);

    // Check if file exists
    if (!existsSync(recipePath)) {
      return NextResponse.json(
        { success: false, error: `Recipe not found: ${path}` },
        { status: 404 }
      );
    }

    // Read YAML file
    const yaml = readFileSync(recipePath, 'utf-8');

    return NextResponse.json({
      success: true,
      yaml: yaml,
    });
  } catch (error: any) {
    console.error('Error loading recipe YAML:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
