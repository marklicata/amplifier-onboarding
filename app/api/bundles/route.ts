import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

interface BundleInfo {
  id: string;
  name: string;
  description: string;
  data: any;
}

export async function GET(request: NextRequest) {
  try {
    const bundlesDir = path.join(process.cwd(), 'lib', 'amplifier', 'bundles');
    
    // Read all JSON files from the bundles directory
    const files = fs.readdirSync(bundlesDir).filter(f => f.endsWith('.json'));
    
    const bundles: BundleInfo[] = [];
    
    for (const file of files) {
      try {
        const filePath = path.join(bundlesDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const bundleData = JSON.parse(content);
        
        bundles.push({
          id: file.replace('.json', ''),
          name: bundleData.name || file,
          description: bundleData.description || 'No description available',
          data: bundleData,
        });
      } catch (err) {
        console.warn(`Failed to parse bundle ${file}:`, err);
      }
    }
    
    // Sort by filename (which has numeric prefix)
    bundles.sort((a, b) => a.id.localeCompare(b.id));
    
    return Response.json({ bundles });
  } catch (error: any) {
    console.error('Failed to load bundles:', error);
    return Response.json(
      { error: 'Failed to load bundles', details: error.message },
      { status: 500 }
    );
  }
}
