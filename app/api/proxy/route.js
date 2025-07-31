// File Path: src/app/api/proxy/route.js

import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');

    if (!targetUrl) {
        return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    try {
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch from external URL. Status: ${response.status}`);
        }

        const htmlContent = await response.text();

        return new Response(htmlContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/html',
            },
        });

    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json({ error: 'Failed to fetch the URL content.', details: error.message }, { status: 500 });
    }
}