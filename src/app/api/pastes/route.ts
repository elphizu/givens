import { z } from 'zod';

import { createPaste } from '@/app/features/pastes/paste.service';
import { createPasteSchema } from '@/app/features/pastes/paste.schema';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = createPasteSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: z.treeifyError(parsed.error) }, { status: 400 });
  }

  const paste = await createPaste(parsed.data);
  return Response.json(paste, { status: 201 });
}
