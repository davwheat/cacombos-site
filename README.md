# Mobile Combos frontend

This is the web frontend for mobilecombos.com, written with React and Gatsby.

## Local development

> ⚠️ You might need to modify `.env.development` and/or `.env.production` in order to ensure the frontend web app works correctly. In development, it defaults to a backend running on `local.davw.network` which resolves to `127.0.0.1`.
>
> In production (e.g., `gatsby build && gatsby serve`), it will attempt to use the live backend at `api.mobilecombos.com`.

1. Clone the repository locally
2. Install all dependencies by running `yarn`
3. Run `yarn develop` to spawn a development server
4. Access a live instance at `localhost:8000`

### Considerations

#### SSR in development

The development environment runs with Gatsby's `DEV_SSR` flag by default, which means it will use the same rendering method in development as it will in production. This loses us some performance, but allows us to locate SSR/SSG errors during development as opposed to only in production.

If this flag needs to be disabled, simply comment the flag out in `gatsby-config.ts`.
