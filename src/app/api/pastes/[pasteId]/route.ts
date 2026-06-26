import { getPaste, deletePaste } from '@/app/features/pastes/paste.service';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pasteId: string }> },
) {
  const { pasteId } = await params;

  const paste = await getPaste(pasteId);

  if (!paste) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  return Response.json(paste);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ pasteId: string }> },
) {
  const { pasteId } = await params;

  const deleted = await deletePaste(pasteId);

  if (!deleted) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  return Response.json({ ok: true });
}
