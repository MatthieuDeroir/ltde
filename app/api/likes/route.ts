import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/auth';
import { toggleLike, getLikesByCapsule } from '@/server/services/likesService';
import { toggleLikeSchema } from '@/core/schemas/like';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const capsuleId = searchParams.get('capsuleId');

    if (!capsuleId) {
      return NextResponse.json({ error: 'capsuleId is required' }, { status: 400 });
    }

    const likes = await getLikesByCapsule(capsuleId);

    return NextResponse.json(likes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !['READER', 'EDITOR', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = toggleLikeSchema.parse(body);

    const result = await toggleLike(session.user.id, data.capsuleId);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
