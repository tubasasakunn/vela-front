# Vela website

The Cloudflare Worker serving [vela.basaapp.com](https://vela.basaapp.com).

```sh
npm install
npm run dev
npm run check
npm run deploy
```

The landing page deliberately has no analytics, forms, cookies, or server-side
state. Update the GitHub release link in `src/index.ts` only if Vela changes
where its notarized releases are published.
