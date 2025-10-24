import { NextResponse } from 'next/server';
import { getMediaById, updateMedia, deleteMedia } from '@/server/services/mediaService';
import { auth } from '@/server/auth';

export async function GET(_request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const media = await getMediaById(params.id);
    return NextResponse.json(media);
  } catch (error: any) {
    console.error('GET /api/media/[id] error:', error);

    if (error.message === 'Media not found') {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    if (!session?.user || (session.user.role !== 'EDITOR' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const params = await props.params;

    const media = await updateMedia(params.id, {
      caption: body.caption,
      altText: body.altText,
      order: body.order,
    });

    return NextResponse.json(media);
  } catch (error: any) {
    console.error('PUT /api/media/[id] error:', error);

    if (error.message === 'Media not found') {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    if (!session?.user || (session.user.role !== 'EDITOR' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await props.params;
    const result = await deleteMedia(params.id);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('DELETE /api/media/[id] error:', error);

    if (error.message === 'Media not found') {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
