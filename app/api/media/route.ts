import { NextResponse } from 'next/server';
import { getAllMedia, createMedia } from '@/server/services/mediaService';
import { auth } from '@/server/auth';
import { MediaType } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as MediaType | null;
    const limit = searchParams.get('limit');
    const cursor = searchParams.get('cursor');

    const media = await getAllMedia({
      type: type || undefined,
      limit: limit ? parseInt(limit) : undefined,
      cursor: cursor || undefined,
    });

    return NextResponse.json(media);
  } catch (error: any) {
    console.error('GET /api/media error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || (session.user.role !== 'EDITOR' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const media = await createMedia({
      capsuleId: body.capsuleId,
      type: body.type,
      url: body.url,
      filename: body.filename,
      mimeType: body.mimeType,
      size: body.size,
      caption: body.caption,
      altText: body.altText,
      order: body.order,
    });

    return NextResponse.json(media);
  } catch (error: any) {
    console.error('POST /api/media error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
