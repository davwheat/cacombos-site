import { useRef } from 'react';

import Colors from '@data/colors.json';
import { nanoid } from 'nanoid';

export interface IRadioButtonProps {
  className?: string;
  label: string;
  onChecked: () => void;
  checked: boolean;
  name: string;
  disabled?: boolean;
}

export default function RadioButton({ name, className, label, checked, onChecked, disabled = false }: IRadioButtonProps) {
  const { current: id } = useRef(nanoid());

  return (
    <div className={className}>
      <input
        type="radio"
        name={name}
        id={id}
        onChange={() => {
          onChecked();
        }}
        checked={checked}
        disabled={disabled}
        css={{
          opacity: 0,
          position: 'absolute',

          '&:focus-visible + label': {
            outline: `2px solid ${Colors.primaryRed}`,
            outlineOffset: 4,
          },

          '&:checked + label::after': {
            '--bg': 'black',
          },
        }}
      />
      <label
        htmlFor={id}
        css={{
          display: 'block',
          position: 'relative',
          paddingLeft: 'var(--left-pad)',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          cursor: 'pointer',

          '--left-pad': 'calc(1em + 16px)',
          '--radio-size': '1.35em',
          '--radio-border-size': '2px',
          '--radio-y-offset': '0.05em',

          '&::before, &::after': {
            content: '""',
            display: 'block',
            position: 'absolute',
            borderRadius: '50%',
            overflow: 'hidden',

            top: 'calc(50% - var(--radio-y-offset))',
            transform: 'translateY(-50%)',

            width: 'var(--size)',
            height: 'var(--size)',

            cursor: 'pointer',
          },

          '&::before': {
            '--size': 'var(--radio-size)',
            left: 0,
            background: 'white',
            border: 'var(--radio-border-size) solid black',
          },

          '&::after': {
            '--bg': 'white',
            '--x-pad': 'calc(var(--radio-border-size) + 4px)',
            '--size': 'calc(var(--radio-size) - (2 * var(--x-pad)))',
            left: 'var(--x-pad)',
            background: 'var(--bg)',
          },
        }}
      >
        {label}
      </label>
    </div>
  );
}
