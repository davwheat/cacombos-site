import React from 'react';

// import Link from '../Links/Link';
// import SocialButtons from '../SocialButtons';

import { graphql, useStaticQuery } from 'gatsby';
import Breakpoints from '@data/breakpoints';

export default function Footer() {
  const {
    siteBuildMetadata,
  }: // gitCommit,
  {
    siteBuildMetadata: {
      /**
       * String date/time formatted as YYYY-MM-DD HH:mm
       */
      buildTime: string;
    };
    // gitCommit: {
    //   /**
    //    * Latest git commit hash at build-time
    //    */
    //   hash: string;
    // };
  } = useStaticQuery(
    graphql`
      {
        siteBuildMetadata {
          buildTime(formatString: "YYYY-MM-DD HH:mm z")
        }
        # gitCommit(latest: { eq: true }) {
        #  hash
        # }
      }
    `
  );

  return (
    <footer
      css={{
        background: '#000',
        color: '#fff',
        padding: '48px 0',
        marginTop: 24,
      }}
    >
      <main
        css={{
          maxWidth: 960,
          margin: 'auto',
          padding: '0 24px',
        }}
      >
        <section
          css={{
            display: 'flex',

            [Breakpoints.upTo.desktopSmall]: {
              flexDirection: 'column',
            },
          }}
        >
          <div
            css={{
              marginRight: 16,
              '& p': {
                paddingBottom: 4,
              },

              [Breakpoints.upTo.desktopSmall]: {
                marginRight: 0,
                marginBottom: 12,
              },
            }}
          >
            <p className="text-speak-up">&copy; {new Date().getFullYear()} David Wheatley</p>
            <p className="text-whisper">
              This site aggregates data contributed by various authors. We cannot guarantee full accuracy of the information on this website.
            </p>

            <p className="text-whisper">
              {/* <a href="https://github.com/davwheat/mastdatabase.co.uk" rel="noopener noreferrer">
                View this site on GitHub
              </a>
              <BulletSeparator /> */}
              This site collects anonymised analytics that do not track individual users.{' '}
              <a href="https://blog.cloudflare.com/free-privacy-first-analytics-for-a-better-web" rel="noopener noreferrer">
                Learn more about Cloudflare analytics
              </a>
            </p>
            <p className="text-whisper">
              Website last updated {/* e.g., 14 Nov 2022, 23:50 GMT */}
              {new Intl.DateTimeFormat(Intl.DateTimeFormat().resolvedOptions().locale, {
                day: 'numeric',
                month: 'short',
                year: 'numeric',

                hour: 'numeric',
                minute: 'numeric',

                timeZoneName: 'short',
              }).format(new Date(siteBuildMetadata.buildTime))}
              .
            </p>
          </div>

          {/* <SocialButtons /> */}
        </section>

        {/* <nav
          css={{
            marginTop: 24,
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: -8,

            '& a': {
              padding: '8px 16px',
              textDecoration: 'none',
              display: 'inline-block',
              borderRight: '1px #ccc solid',
              borderLeft: '1px #ccc solid',
              marginBottom: 8,
              fontWeight: 400,
              '&:not(:first-child)': {
                marginLeft: -1,
              },
              '&:hover, &:focus, &:active': {
                background: '#fff',
                color: '#000',
                borderColor: '#000',
              },
            },
          }}
        >
          <Link href="/">Home</Link>
          <Link href="https://davwheat.dev/">David Wheatley</Link>
        </nav> */}
      </main>
    </footer>
  );
}

function BulletSeparator() {
  return (
    <span
      css={{
        display: 'inline-block',
        verticalAlign: 'middle',
        transformOrigin: 'center',
        transform: 'scale(2)',
        marginLeft: 8,
        marginRight: 8,
        color: '#fff',
      }}
    >
      •
    </span>
  );
}
