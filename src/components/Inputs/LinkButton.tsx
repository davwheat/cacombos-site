interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  className?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

export default function LinkButton({ children, className, onClick, type = 'button', ...props }: Props) {
  return (
    <button
      onClick={onClick}
      className={className}
      type={type}
      css={{
        appearance: 'none',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        textDecoration: 'underline',
        fontFamily: 'inherit',
        fontSize: '1em',
        fontWeight: 700,
        display: 'inline',
        margin: 0,
        padding: 0,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
