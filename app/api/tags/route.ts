import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/auth';
import { getAllTags, createTag } from '@/server/services/tagsService';
import { createTagSchema } from '@/core/schemas/tag';

export async function GET() {
  try {
    const tags = await getAllTags();
    return NextResponse.json(tags);
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
    const data = createTagSchema.parse(body);

    const tag = await createTag(data);

    return NextResponse.json(tag, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
