import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Proxy failed to fetch ${url}: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.statusText}` }, 
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const arrayBuffer = await response.arrayBuffer();
    
    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        // Cache for a day to reduce load on origin
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
