import React from 'react';

import Colors from '@data/colors.json';

import LoadingSpinner from '@components/LoadingSpinner';

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
  variant?: 'normal' | 'danger';
}

export default function Button({ className, children, loading = false, disabled, icon, variant, ...props }: IButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      css={[
        {
          appearance: 'none',
          // background: 'none',
          border: 'none',
          cursor: 'pointer',
          textDecoration: 'none',
          fontFamily: 'inherit',
          fontSize: '1em',
          fontWeight: 700,
          margin: 'unset',
          // padding: 0,

          padding: '16px 24px',
          background: 'black',
          color: 'white',

          display: 'flex',
          alignItems: 'center',

          '&:focus-visible': {
            outline: `4px solid ${Colors.primaryRed}`,
          },

          '&:hover': {
            background: Colors.primaryRed,
            color: 'white',
          },

          '&:active': {
            background: Colors.pale.primaryRed,
            color: 'black',
          },

          '&[disabled]': {
            background: Colors.neutralGrey,
            color: 'black',
            cursor: 'not-allowed',
          },
        },
        variant === 'danger'
          ? {
              background: Colors.cautioningAmber,
              color: 'black',

              '&:hover': {
                background: Colors.excessiveYellow,
                color: 'black',
              },

              '&:active': {
                background: '#ecb204',
                color: 'black',
              },
            }
          : {},
        className,
      ]}
      className={className}
      {...props}
    >
      {loading && (
        <>
          <LoadingSpinner size={24} style={{ marginRight: 12 }} />{' '}
        </>
      )}

      {!!icon && (
        <span
          className="icon"
          css={{
            marginLeft: -4,
            marginRight: 8,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {icon}
        </span>
      )}

      {children}
    </button>
  );
}
