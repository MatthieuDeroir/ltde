import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/auth';
import { getCommentsByCapsule, createComment } from '@/server/services/commentsService';
import { createCommentSchema } from '@/core/schemas/comment';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const capsuleId = searchParams.get('capsuleId');

    if (!capsuleId) {
      return NextResponse.json({ error: 'capsuleId is required' }, { status: 400 });
    }

    const comments = await getCommentsByCapsule(capsuleId);

    return NextResponse.json(comments);
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
    const data = createCommentSchema.parse(body);

    const comment = await createComment(session.user.id, data);

    return NextResponse.json(comment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
