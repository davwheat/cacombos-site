import Link from '@components/Links/Link';

import Breakpoints from '@data/breakpoints';

import dayjs from 'dayjs';
import { graphql, useStaticQuery } from 'gatsby';

export default function Footer() {
  const {
    siteBuildMetadata,
    gitCommit,
  }: {
    siteBuildMetadata: {
      /**
       * String date/time formatted as YYYY-MM-DD HH:mm
       */
      buildTime: string;
    };
    gitCommit: {
      /**
       * Latest git commit hash at build-time
       */
      hash: string;
    };
  } = useStaticQuery(
    graphql`
      {
        siteBuildMetadata {
          buildTime(formatString: "YYYY-MM-DD HH:mm z")
        }
        gitCommit(latest: { eq: true }) {
          hash
        }
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
              <Link href="https://github.com/mobilecombos/website-frontend">View this site on GitHub</Link>
              <BulletSeparator />
              This site collects anonymised analytics that do not track individual users.{' '}
              <a href="https://blog.cloudflare.com/free-privacy-first-analytics-for-a-better-web" rel="noopener noreferrer">
                Learn more about Cloudflare analytics
              </a>
            </p>
            <p className="text-whisper">
              Website version: {siteBuildMetadata.buildTime} (
              <Link target="_blank" href={`https://github.com/mobilecombos/website-frontend/commit/${gitCommit.hash}`}>
                {gitCommit.hash.substring(0, 6)})
              </Link>
              .
            </p>
          </div>
        </section>

        <nav
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
              '&:not(:first-of-type)': {
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
          <Link href="/privacy-policy">Privacy policy</Link>
          <Link href="https://mastdatabase.co.uk/">mastdatabase.co.uk</Link>
        </nav>
      </main>
    </footer>
  );
}

function BulletSeparator() {
  return (
    <span
      css={{
        display: 'inline-block',
        marginLeft: 6,
        marginRight: 6,
        color: '#fff',
      }}
    >
      •
    </span>
  );
}
