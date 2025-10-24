import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/auth';
import {
  getCapsuleById,
  updateCapsule,
  deleteCapsule,
} from '@/server/services/capsulesService';
import { updateCapsuleSchema } from '@/core/schemas/capsule';

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const session = await auth();
    const capsule = await getCapsuleById(params.id, session?.user.id);

    return NextResponse.json(capsule);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}

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
    const data = updateCapsuleSchema.parse(body);

    const capsule = await updateCapsule(params.id, session.user.id, data);

    return NextResponse.json(capsule);
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

    const result = await deleteCapsule(params.id, session.user.id);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
