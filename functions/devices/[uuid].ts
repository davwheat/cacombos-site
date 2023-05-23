import { URL, type EventContext, type Fetcher } from '@cloudflare/workers-types';

const NEW_URI = '/devices/[...]/';

export function onRequestGet({ env, request }: EventContext<Env, string, unknown>) {
  return env.ASSETS.fetch(new URL(NEW_URI, request.url), request).toString();
}

interface Env {
  ASSETS: Fetcher;
}
