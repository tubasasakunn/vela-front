# Vela website

The Cloudflare Worker serving [vela.basaapp.com](https://vela.basaapp.com).

```sh
npm install
npm run dev
npm run check
npm run deploy
```

The landing page deliberately has no analytics, forms, cookies, or server-side
state. `/download` redirects directly to the stable `Vela-latest.dmg` asset
published automatically by the Vela release workflow.

The Japanese landing page has three interactive, local-only product demos.
Page markup is in `src/landing.ts`, styles in `src/styles.ts`, and browser
behavior in `src/demo.ts`. `src/index.ts` preserves download and AI setup routes.
See [DESIGN.md](DESIGN.md) for design choices and the browser verification flow.
