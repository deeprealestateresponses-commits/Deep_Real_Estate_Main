/*
  /api/admin/blogs      — GET every article (drafts included), POST a new one
  /api/admin/blogs/:id  — GET, PUT or DELETE one article

  One function via an optional catch-all (Hobby 12-function cap). requireSession
  is the first statement of every path.
*/
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../../_lib/db.js';
import { requireSession } from '../../_lib/auth.js';
import {
  badRequest, conflict, handler, json, methodNotAllowed, noStore, notFound,
} from '../../_lib/http.js';
import { toBlog } from '../../_lib/shape.js';
import { blogInput } from '../../_lib/validate.js';

export default handler(async (req: VercelRequest, res: VercelResponse) => {
  if (!requireSession(req, res)) return;   // must stay the first statement
  noStore(res);

  const segments = req.query.id;
  const idParam = Array.isArray(segments) ? segments[0] : segments;

  /* ---- collection ---- */
  if (!idParam) {
    if (req.method === 'GET') {
      const rows = await sql`
        SELECT * FROM blogs ORDER BY COALESCE(published_at, created_at) DESC
      `;
      return json(res, 200, { blogs: rows.map(toBlog) });
    }
    if (req.method === 'POST') {
      const b = blogInput(req.body);

      const existing = await sql`SELECT 1 FROM blogs WHERE slug = ${b.slug} LIMIT 1`;
      if (existing.length > 0) throw conflict(`An article with the slug "${b.slug}" already exists`);

      // Publishing without an explicit date stamps it now, so the index can
      // order by something meaningful straight away.
      const publishedAt = b.publishedAt ?? (b.published ? new Date().toISOString() : null);

      const rows = await sql`
        INSERT INTO blogs (slug, title, excerpt, cover_image, body, published, published_at)
        VALUES (${b.slug}, ${b.title}, ${b.excerpt}, ${b.coverImage}, ${b.body},
                ${b.published}, ${publishedAt})
        RETURNING *
      `;
      return json(res, 201, { blog: toBlog(rows[0]) });
    }
    return methodNotAllowed(res, ['GET', 'POST']);
  }

  /* ---- one article ---- */
  const id = Number(idParam);
  if (!Number.isInteger(id)) throw badRequest('Invalid article id');

  if (req.method === 'GET') {
    const rows = await sql`SELECT * FROM blogs WHERE id = ${id} LIMIT 1`;
    if (rows.length === 0) throw notFound('Article not found');
    return json(res, 200, { blog: toBlog(rows[0]) });
  }

  if (req.method === 'PUT') {
    const b = blogInput(req.body);

    // The slug is editable, but it must stay unique — it addresses the page.
    const clash = await sql`
      SELECT 1 FROM blogs WHERE slug = ${b.slug} AND id <> ${id} LIMIT 1
    `;
    if (clash.length > 0) throw conflict(`Another article already uses the slug "${b.slug}"`);

    const publishedAt = b.publishedAt ?? (b.published ? new Date().toISOString() : null);

    const rows = await sql`
      UPDATE blogs SET
        slug = ${b.slug}, title = ${b.title}, excerpt = ${b.excerpt},
        cover_image = ${b.coverImage}, body = ${b.body},
        published = ${b.published}, published_at = ${publishedAt}, updated_at = now()
      WHERE id = ${id}
      RETURNING *
    `;
    if (rows.length === 0) throw notFound('Article not found');
    return json(res, 200, { blog: toBlog(rows[0]) });
  }

  if (req.method === 'DELETE') {
    const rows = await sql`DELETE FROM blogs WHERE id = ${id} RETURNING id`;
    if (rows.length === 0) throw notFound('Article not found');
    return json(res, 200, { ok: true, id });
  }

  methodNotAllowed(res, ['GET', 'PUT', 'DELETE']);
});
