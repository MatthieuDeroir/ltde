import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/auth';
import { getCapsules, createCapsule } from '@/server/services/capsulesService';
import { createCapsuleSchema, getCapsulesSchema } from '@/core/schemas/capsule';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters = getCapsulesSchema.parse({
      status: searchParams.get('status'),
      tags: searchParams.getAll('tags'),
      search: searchParams.get('search'),
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      cursor: searchParams.get('cursor'),
    });

    const result = await getCapsules(filters);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !['EDITOR', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = createCapsuleSchema.parse(body);

    const capsule = await createCapsule(session.user.id, data);

    return NextResponse.json(capsule, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
