import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/auth';
import { updateComment, deleteComment } from '@/server/services/commentsService';
import { updateCommentSchema } from '@/core/schemas/comment';

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = updateCommentSchema.parse(body);

    const comment = await updateComment(params.id, session.user.id, data.content);

    return NextResponse.json(comment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = session.user.role === 'ADMIN';
    const result = await deleteComment(params.id, session.user.id, isAdmin);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
