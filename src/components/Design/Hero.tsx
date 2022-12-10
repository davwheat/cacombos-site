import clsx from 'clsx';
import bestContrast from 'get-best-contrast-color';
import Breakpoints from '@data/breakpoints';

export interface HeroProps {
  color?: string;
  size?: 'small' | 'normal' | 'large' | 'huge';
  firstElement?: boolean;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}

export default function Hero({ children, color = '#000', size = 'normal', firstElement = false, className, innerClassName }: HeroProps) {
  return (
    <section
      className={clsx('Hero', className)}
      css={[
        {
          width: '100vw',
          position: 'relative',
          marginLeft: '-50vw',
          left: '50%',
          background: '#000',
          color: '#fff',
          overflow: 'hidden',
        },
        firstElement
          ? {
              marginTop: -24,
            }
          : {},
        size === 'small'
          ? {
              '& .Hero-inner': {
                paddingTop: 24,
                paddingBottom: 24,
                [Breakpoints.upTo.desktopSmall]: {
                  paddingTop: 16,
                  paddingBottom: 16,
                },
              },
            }
          : {},
        size === 'normal'
          ? {
              '& .Hero-inner': {
                paddingTop: 48,
                paddingBottom: 48,
                [Breakpoints.upTo.desktopSmall]: {
                  paddingTop: 24,
                  paddingBottom: 24,
                },
              },
            }
          : {},
        size === 'large'
          ? {
              '& .Hero-inner': {
                paddingTop: 56,
                paddingBottom: 56,
                [Breakpoints.upTo.desktopSmall]: {
                  paddingTop: 36,
                  paddingBottom: 36,
                },
              },
            }
          : {},
        size === 'huge'
          ? {
              '& .Hero-inner': {
                paddingTop: 72,
                paddingBottom: 72,
                [Breakpoints.upTo.desktopSmall]: {
                  paddingTop: 48,
                  paddingBottom: 48,
                },
              },
            }
          : {},
      ]}
      style={{ backgroundColor: color, color: bestContrast(color, ['#000', '#fff']) }}
    >
      <div
        className={clsx('Hero-inner', innerClassName)}
        css={{
          width: '100%',
          margin: 'auto',
          maxWidth: 1000,
          paddingLeft: 48,
          paddingRight: 48,
          paddingTop: 48,
          paddingBottom: 48,
          '& p, & h1, & h2, & h3, & h4, & h5, & h6': {
            marginBottom: '0.1em',
            '&:last-child': {
              margin: 0,
            },
          },
          [Breakpoints.upTo.desktopSmall]: {
            paddingLeft: 36,
            paddingRight: 36,
          },
          [Breakpoints.upTo.phone]: {
            paddingLeft: 24,
            paddingRight: 24,
          },
        }}
      >
        {children}
      </div>
    </section>
  );
}
