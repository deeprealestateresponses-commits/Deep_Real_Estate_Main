/*
  /api/admin/properties        — GET every listing (drafts included), POST a new one
  /api/admin/properties/:id     — GET, PUT or DELETE one listing

  One function via an optional catch-all, to stay under the Hobby plan's
  12-function cap. requireSession is the first statement of every path.
*/
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../../_lib/db.js';
import { requireSession } from '../../_lib/auth.js';
import { conflict, handler, json, methodNotAllowed, noStore, notFound } from '../../_lib/http.js';
import { toAdminProperty } from '../../_lib/shape.js';
import { propertyInput } from '../../_lib/validate.js';

export default handler(async (req: VercelRequest, res: VercelResponse) => {
  if (req.query.__debug) return json(res, 200, { url: req.url, query: req.query, method: req.method });
  if (!requireSession(req, res)) return;   // must stay the first statement
  noStore(res);

  const segments = req.query.id;
  const id = Array.isArray(segments) ? segments[0] : segments;

  /* ---- collection: /api/admin/properties ---- */
  if (!id) {
    if (req.method === 'GET') {
      const rows = await sql`
        SELECT * FROM properties ORDER BY sort_order ASC, created_at DESC
      `;
      return json(res, 200, { properties: rows.map(toAdminProperty) });
    }

    if (req.method === 'POST') {
      const p = propertyInput(req.body, { withId: true });

      const existing = await sql`SELECT 1 FROM properties WHERE id = ${p.id!} LIMIT 1`;
      if (existing.length > 0) {
        throw conflict(`A property with the id "${p.id}" already exists`);
      }

      const rows = await sql`
        INSERT INTO properties (
          id, property_id, name, location, address, price, price_unit, badge,
          image, images, specs, overview, description, features, published, sort_order
        ) VALUES (
          ${p.id!}, ${p.propertyId}, ${p.name}, ${p.location}, ${p.address}, ${p.price},
          ${p.priceUnit}, ${p.badge}, ${p.image},
          ${JSON.stringify(p.images)}::jsonb, ${JSON.stringify(p.specs)}::jsonb,
          ${JSON.stringify(p.overview)}::jsonb, ${JSON.stringify(p.description)}::jsonb,
          ${JSON.stringify(p.features)}::jsonb, ${p.published}, ${p.sortOrder}
        )
        RETURNING *
      `;
      return json(res, 201, { property: toAdminProperty(rows[0]) });
    }

    return methodNotAllowed(res, ['GET', 'POST']);
  }

  /* ---- one listing: /api/admin/properties/:id ---- */
  if (req.method === 'GET') {
    const rows = await sql`SELECT * FROM properties WHERE id = ${id} LIMIT 1`;
    if (rows.length === 0) throw notFound('Property not found');
    return json(res, 200, { property: toAdminProperty(rows[0]) });
  }

  if (req.method === 'PUT') {
    // The id comes from the URL, never the body: renaming would break every
    // link that already points at the listing.
    const p = propertyInput(req.body, { withId: false });

    const rows = await sql`
      UPDATE properties SET
        property_id = ${p.propertyId},
        name        = ${p.name},
        location    = ${p.location},
        address     = ${p.address},
        price       = ${p.price},
        price_unit  = ${p.priceUnit},
        badge       = ${p.badge},
        image       = ${p.image},
        images      = ${JSON.stringify(p.images)}::jsonb,
        specs       = ${JSON.stringify(p.specs)}::jsonb,
        overview    = ${JSON.stringify(p.overview)}::jsonb,
        description = ${JSON.stringify(p.description)}::jsonb,
        features    = ${JSON.stringify(p.features)}::jsonb,
        published   = ${p.published},
        sort_order  = ${p.sortOrder},
        updated_at  = now()
      WHERE id = ${id}
      RETURNING *
    `;
    if (rows.length === 0) throw notFound('Property not found');
    return json(res, 200, { property: toAdminProperty(rows[0]) });
  }

  if (req.method === 'DELETE') {
    const rows = await sql`DELETE FROM properties WHERE id = ${id} RETURNING id`;
    if (rows.length === 0) throw notFound('Property not found');
    // Uploaded images are left in blob storage on purpose: the same photograph
    // may be reused by another listing, and an orphaned file is cheaper than a
    // delete that silently breaks a live page.
    return json(res, 200, { ok: true, id });
  }

  methodNotAllowed(res, ['GET', 'PUT', 'DELETE']);
});
