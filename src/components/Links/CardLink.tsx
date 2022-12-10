import Link from '../Links/Link';

import generateTransitions from '@functions/generateTransitions';

interface ICardLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const CARD_PADDING = 16 as const;

function CardLink({ children, to, className }: ICardLinkProps) {
  return (
    <Link
      href={to}
      className={className}
      css={{
        textDecoration: 'none',
        display: 'flex',
        border: '2px solid black',
        outline: '0px solid black',
        fontWeight: 'normal',

        '&:hover, &:focus, &:active': {
          outlineWidth: 2,
          '& .CardLink-Arrow': {
            '&::after': {
              transform: 'translateX(3px) scaleY(0.92) scaleX(1.05) rotate(45deg)',
            },
          },
        },
      }}
    >
      <article
        css={{
          display: 'flex',
          flexDirection: 'column',
          padding: CARD_PADDING,
          position: 'relative',
          flexGrow: 1,
        }}
      >
        {children}
      </article>
      <div
        className="CardLink-Arrow"
        aria-hidden="true"
        css={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '10px 18px',
          paddingRight: 20,
          gap: 8,
          transformOrigin: 'center',

          '&::after': {
            content: '""',
            display: 'inline-block',
            width: '0.75em',
            height: '0.75em',
            borderTop: '2px solid currentColor',
            borderRight: '2px solid currentColor',
            transform: 'rotate(45deg)',
            ...generateTransitions('transform'),
          },
        }}
      />
    </Link>
  );
}

export default CardLink;
