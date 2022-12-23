import Colors from '@data/colors.json';

import type React from 'react';

export interface IMinorAlertProps {
  className?: string;
  heading?: React.ReactNode;
  children: React.ReactNode;
  color: keyof typeof Colors['pale'];
  coloredBackground?: boolean;
}

export default function MinorAlert({ className, heading, children, color, coloredBackground = false }: IMinorAlertProps) {
  return (
    <div
      className={className}
      css={{
        '--bg-color': 'white',
        backgroundColor: 'var(--bg-color)',
        padding: '12px 16px',
        borderTop: `6px solid var(--color)`,

        '& p:last-child': {
          marginBottom: 0,
        },
      }}
      style={{ '--color': Colors[color], ...(!coloredBackground ? {} : { '--bg-color': Colors.pale[color] }) } as any}
    >
      {heading && (
        <h3
          className="text-speak-up"
          css={{
            marginBottom: 6,
          }}
        >
          {heading}
        </h3>
      )}

      {children}
    </div>
  );
}
