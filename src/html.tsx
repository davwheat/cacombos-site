import React from 'react';
import { ApiStoreContext } from './api/ApiStoreProvider';

export default function HTML(props: Props) {
  return (
    <html lang="en-GB" {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* <!-- Cloudflare Web Analytics --> */}
        <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "05bfb3e2a2564c458c829e3a856c5f49"}' />

        {props.headComponents}
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}

        <ApiStoreContext>
          <div key="body" id="___gatsby" dangerouslySetInnerHTML={{ __html: props.body }} />
        </ApiStoreContext>

        {props.postBodyComponents}
      </body>
    </html>
  );
}

interface Props {
  htmlAttributes: Record<string, unknown>;
  headComponents: React.ReactNode;
  bodyAttributes: Record<string, unknown>;
  preBodyComponents: React.ReactNode;
  body: string;
  postBodyComponents: React.ReactNode;
}
