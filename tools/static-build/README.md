# Static export

Renders the PHP site into `static/` — plain HTML, CSS, JS and images, with no
server-side code — so it can be hosted on Vercel for client presentation.

```bash
python3 tools/static-build/build.py
```

PHP is used **only at build time**. Nothing PHP ends up in `static/`.

## How it works

1. `build.py` assembles a throwaway workspace in `.static-build-tmp/` that is a
   copy of the site with one substitution: `admin/include/MeecroDB.php` is
   replaced by `db-stub.php`.
2. Each page is executed once per record (`PropertiesDetails.php?pid=3` becomes
   `PropertiesDetails-3.html`) and the output captured.
3. Links are rewritten from `.php` routes to the generated `.html` files,
   root-absolute asset paths (`/admin/...`) are made relative, and the inline
   jQuery that posted to `include/function_do.php` is swapped for
   `demo-forms.js`.
4. Referenced assets are copied across.

## Files

| File | Purpose |
| --- | --- |
| `build.py` | The renderer and rewriter. |
| `db-stub.php` | Demo data. Stands in for the database, which has no dump in this repo. Edit `demo_props()`, `demo_maps()`, `demo_developers()` and `demo_docs()` to change what the demo shows. |
| `demo-forms.js` | Browser-side stand-in for the PHP endpoints — forms validate, log to the console, run a mock API call and confirm with a toast; the Maps/Developers/Docs search boxes filter the rendered cards. |

## Changing the demo content

Edit `db-stub.php`, re-run `build.py`, commit `static/`. Property photographs,
map images and developer logos come from the real `admin/assets/` folders, so
any filename that exists there can be used.
