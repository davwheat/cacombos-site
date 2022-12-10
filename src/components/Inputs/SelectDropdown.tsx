import { useRef } from 'react';

import { nanoid } from 'nanoid';

import Colors from '@data/colors.json';

interface ISelectDropdownProps {
  label: string;
  options: {
    label: string;
    value: string;
  }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  selectClassName?: string;
  disabled?: boolean;
  /**
   * Optional helper text which appears under the textbox. Correctly linked via `aria-describedby`.
   */
  helpText?: React.ReactNode;

  endAdornment?: React.ReactNode;
}

export default function SelectDropdown({
  label,
  value,
  options,
  onChange,
  className,
  selectClassName,
  helpText,
  disabled = false,
  endAdornment,
}: ISelectDropdownProps) {
  const {
    current: { selectId, helpTextId },
  } = useRef({ selectId: nanoid(), helpTextId: nanoid() });

  return (
    <label
      htmlFor={selectId}
      className={className}
      css={{
        display: 'block',
      }}
    >
      <span
        className="text-speak-up"
        css={{
          display: 'block',
          marginBottom: 8,
        }}
      >
        {label}
      </span>

      <div
        className="select-wrapper"
        css={{
          display: 'flex',
        }}
      >
        <div
          css={{
            position: 'relative',
            flexGrow: '1',

            '&::after': {
              content: '""',
              display: 'block',

              '--size': 16 * Math.sin(Math.PI / 4) + 'px',

              position: 'absolute',
              width: 'var(--size)',
              height: 'var(--size)',
              right: 16,
              top: 'calc(50% - 8px)',
              border: '2px solid black',
              borderTop: '0',
              borderLeft: '0',

              transform: 'rotate(45deg)',
              transformOrigin: 'center',

              pointerEvents: 'none',
            },
          }}
        >
          <select
            id={selectId}
            className={selectClassName}
            disabled={disabled}
            css={{
              // A reset of styles, including removing the default dropdown arrow
              appearance: 'none',
              // Additional resets for further consistency
              backgroundColor: 'white',
              margin: 0,
              width: '100%',
              font: 'inherit',
              cursor: 'pointer',
              padding: '6px 12px',
              border: '2px solid black',
              borderRadius: 0,
              paddingRight: 48,

              '&:focus-visible': {
                borderColor: Colors.primaryRed,
                outline: 'none',
              },
            }}
            value={value}
            onChange={(e) => {
              onChange(e.currentTarget.value);
            }}
          >
            {options.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {endAdornment}
      </div>

      {helpText && (
        <p
          id={helpTextId}
          className="text-whisper"
          css={{
            marginTop: 4,
            marginBottom: 0,
          }}
        >
          {helpText}
        </p>
      )}
    </label>
  );
}
