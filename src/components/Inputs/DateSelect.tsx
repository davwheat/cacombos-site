import Colors from '@data/colors.json';

import { useMemo } from 'react';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

interface IProps extends Omit<React.HTMLAttributes<HTMLInputElement>, 'onInput'> {
  /**
   * Class for the outer-most element of the component (`<label>`).
   */
  className?: string;
  /**
   * The value used to populate the input field.
   */
  value: Date;
  /**
   * A textual label to display on-screen.
   */
  label: string;
  /**
   * An optional label to override the standard label, read only to screenreaders.
   */
  screenReaderLabel?: string;
  /**
   * Callback triggered when a date is selected.
   */
  onInput: (val: Date) => void;
  /**
   * Optional input placeholder.
   */
  placeholder?: string;
  /**
   * Optional helper text which appears under the textbox. Correctly linked via `aria-describedby`.
   */
  helpText?: React.ReactChild;
  /**
   * An optional element to display at the start of the input field.
   *
   * If used to show units, for example, you should set an appropriate `screenReaderLabel` as these adornments are hidden to screenreaders.
   */
  startAdornment?: React.ReactChild;
  /**
   * An optional element to display at the end of the input field.
   *
   * If used to show units, for example, you should set an appropriate `screenReaderLabel` as these adornments are hidden to screenreaders.
   */
  endAdornment?: React.ReactChild;
  /**
   * RegEx pattern for validation
   */
  pattern?: string;
}

export default function DateSelect({
  label,
  screenReaderLabel,
  onInput,
  className,
  value,
  placeholder,
  helpText,
  startAdornment: startAppendix,
  endAdornment: endAppendix,
  ...attrs
}: IProps) {
  const id = useMemo(() => nanoid(), []);
  const helpTextId = useMemo(() => nanoid(), []);

  return (
    <label
      htmlFor={id}
      className={className}
      aria-label={screenReaderLabel}
      css={{
        '& > span': {
          display: 'block',
        },
      }}
    >
      <span className="text-speak-up">{label}</span>

      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          marginTop: 8,
          position: 'relative',
          background: 'white',

          border: '2px solid black',

          '&:focus-within': {
            borderColor: Colors.primaryRed,
          },
        }}
      >
        {startAppendix && (
          <span
            aria-hidden="true"
            css={{
              paddingLeft: 8,
            }}
          >
            {startAppendix}
          </span>
        )}

        <input
          type="date"
          id={id}
          onInput={(e) => {
            const v = (e.target as HTMLInputElement).value;
            const date = dayjs(v).toDate();
            onInput(date);
          }}
          value={dayjs(value).format('YYYY-MM-DD')}
          placeholder={placeholder}
          aria-describedby={helpText ? helpTextId : undefined}
          {...attrs}
          css={{
            padding: '6px 8px',
            border: 'none',
            font: 'inherit',
            width: '100%',

            '&:focus': {
              outline: 'none',
            },

            '&::-webkit-search-cancel-button': {
              WebkitAppearance: 'none',
              height: 24,
              width: 24,
              backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23777'><path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/></svg>")`,
              cursor: 'pointer',
            },
          }}
        />

        {endAppendix && (
          <span
            aria-hidden="true"
            css={{
              paddingRight: 8,
            }}
          >
            {endAppendix}
          </span>
        )}
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
