/*
  /api/admin/notices      — GET all notices (drafts and expired included), POST a new one
  /api/admin/notices/:id  — PUT or DELETE one notice

  One function via an optional catch-all (Hobby 12-function cap). requireSession
  is the first statement of every path.
*/
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../../_lib/db.js';
import { requireSession } from '../../_lib/auth.js';
import { badRequest, handler, json, methodNotAllowed, noStore, notFound } from '../../_lib/http.js';
import { toNotice } from '../../_lib/shape.js';
import { noticeInput } from '../../_lib/validate.js';

export default handler(async (req: VercelRequest, res: VercelResponse) => {
  if (!requireSession(req, res)) return;   // must stay the first statement
  noStore(res);

  const segments = req.query.id;
  const idParam = Array.isArray(segments) ? segments[0] : segments;

  /* ---- collection ---- */
  if (!idParam) {
    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM notices ORDER BY created_at DESC`;
      return json(res, 200, { notices: rows.map(toNotice) });
    }
    if (req.method === 'POST') {
      const n = noticeInput(req.body);
      const rows = await sql`
        INSERT INTO notices (body, starts_at, ends_at, published)
        VALUES (${n.body}, ${n.startsAt}, ${n.endsAt}, ${n.published})
        RETURNING *
      `;
      return json(res, 201, { notice: toNotice(rows[0]) });
    }
    return methodNotAllowed(res, ['GET', 'POST']);
  }

  /* ---- one notice ---- */
  const id = Number(idParam);
  if (!Number.isInteger(id)) throw badRequest('Invalid notice id');

  if (req.method === 'PUT') {
    const n = noticeInput(req.body);
    const rows = await sql`
      UPDATE notices SET
        body = ${n.body}, starts_at = ${n.startsAt}, ends_at = ${n.endsAt},
        published = ${n.published}, updated_at = now()
      WHERE id = ${id}
      RETURNING *
    `;
    if (rows.length === 0) throw notFound('Notice not found');
    return json(res, 200, { notice: toNotice(rows[0]) });
  }

  if (req.method === 'DELETE') {
    const rows = await sql`DELETE FROM notices WHERE id = ${id} RETURNING id`;
    if (rows.length === 0) throw notFound('Notice not found');
    return json(res, 200, { ok: true, id });
  }

  methodNotAllowed(res, ['PUT', 'DELETE']);
});
