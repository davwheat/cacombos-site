import React from 'react';
import Breakpoints from '@data/breakpoints';
import Colors from '@data/colors.json';

export interface ISectionProps extends React.HTMLAttributes<HTMLDivElement> {
  usePadding?: boolean;
  width?: 'normal' | 'wider' | 'full';
  darker?: boolean;
  children: React.ReactNode;
  component?: any;
}

export default function Section({
  children,
  usePadding,
  width = 'normal',
  darker = false,
  component = 'section',
  className,
  ...props
}: ISectionProps) {
  const Comp = component;

  return (
    <Comp
      {...props}
      className={className}
      css={[
        {
          marginTop: 24,
          marginBottom: 24,
          [Breakpoints.downTo.desktopSmall]: {
            marginTop: 48,
            marginBottom: 48,
          },
        },
        usePadding
          ? {
              marginTop: 0,
              marginBottom: 0,
              paddingTop: 24,
              paddingBottom: 24,
              [Breakpoints.downTo.desktopSmall]: {
                marginTop: 0,
                marginBottom: 0,
                paddingTop: 48,
                paddingBottom: 48,
              },
            }
          : {},
        width === 'full'
          ? {
              width: '100vw',
              position: 'relative',
              marginLeft: '-50vw',
              left: '50%',
            }
          : {},
        width === 'wider'
          ? {
              width: '100vw',
              position: 'relative',
              marginLeft: '-50vw',
              left: '50%',
            }
          : {},
        darker
          ? {
              background: Colors.lightGrey,
              paddingTop: 36,
              paddingBottom: 36,

              width: '100vw',
              position: 'relative',
              marginLeft: '-50vw',
              left: '50%',
            }
          : {},
      ]}
    >
      <div
        css={[
          {
            maxWidth: 720,
            margin: 'auto',
            paddingLeft: 24,
            paddingRight: 24,
          },
          width === 'full'
            ? {
                padding: '0 8px',
              }
            : {},
          width === 'wider'
            ? {
                maxWidth: 960,
                margin: 'auto',
                paddingLeft: 24,
                paddingRight: 24,
              }
            : {},
        ]}
      >
        {children}
      </div>
    </Comp>
  );
}
