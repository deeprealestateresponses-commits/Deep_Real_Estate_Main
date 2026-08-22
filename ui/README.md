# Component Sandbox

Isolated React + TypeScript + Tailwind v4 playground for designing UI components
before porting them into the PHP site. **Nothing in this folder affects the live
site** — delete `ui/` and the website is untouched.

## Run it

```bash
cd ui
npm install    # first time only
npm run dev    # http://127.0.0.1:5173
```

Other scripts: `npm run typecheck`, `npm run build`.

## Folder convention — one folder per component

```
src/
├── components/ui/
│   └── navbar/                      ← one folder per component family
│       ├── limelight-nav.tsx        ← the component
│       ├── limelight-nav.demo.tsx   ← the demo/usage examples
│       └── index.ts                 ← re-exports
├── lib/utils.ts                     ← cn() class merger
├── registry.tsx                     ← the ONE file you edit to list a component
├── index.css                        ← design tokens (colours, radius, dark mode)
└── App.tsx                          ← gallery shell (sidebar + preview + theme toggle)
```

## Adding a new component

1. Make a folder: `src/components/ui/<name>/`
2. Drop the component in as `<name>.tsx`
3. Put the demo in `<name>.demo.tsx`, exporting one component per variant
4. Add an entry to `src/registry.tsx`

It then appears in the sidebar. That's the whole workflow.

## Design tokens

Components written against shadcn/ui class names (`bg-card`, `text-foreground`,
`bg-primary`, `border`, `text-muted-foreground`, …) work out of the box. The
tokens live in `src/index.css` — `--primary` is set to Deep Real Estate's brand
blue `#0080c6` so previews match the real site. Light and dark are both defined;
toggle with the button in the top right.

## Notes on pasted components

Component code from libraries/generators usually arrives as one blob containing
both the component and its demo, with imports like `@/components/ui/<thing>`.
Split it: component in `<name>.tsx`, demo in `<name>.demo.tsx`, and point the
demo's import at `./<name>`. The `@/` alias is configured and maps to `src/`.
