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
