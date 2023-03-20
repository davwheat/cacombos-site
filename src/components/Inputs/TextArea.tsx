import React, { useId } from 'react';

import Colors from '@data/colors.json';

interface IProps extends Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, 'onInput'> {
  /**
   * Class for the outer-most element of the component (`<label>`).
   */
  className?: string;
  /**
   * The default value used to populate the input field.
   */
  value?: string;
  /**
   * A textual label to display on-screen.
   */
  label: string;
  /**
   * An optional label to override the standard label, read only to screenreaders.
   */
  screenReaderLabel?: string;
  /**
   * Callback triggered when text is inputted to the text input.
   */
  onInput: (val: string) => void;
  /**
   * Optional input placeholder.
   */
  placeholder?: string;
  /**
   * Optional helper text which appears under the textbox. Correctly linked via `aria-describedby`.
   */
  helpText?: React.ReactNode;
  disabled?: boolean;
}

export default function TextArea({
  label,
  screenReaderLabel,
  onInput,
  className,
  value = '',
  placeholder,
  helpText,
  disabled = false,
  ...attrs
}: IProps) {
  const rootId = useId();
  const id = `textarea-${rootId}`;
  const helpTextId = `textarea-help-${rootId}`;

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
        <textarea
          id={id}
          disabled={disabled}
          onInput={(e) => {
            const v = (e.target as HTMLTextAreaElement).value;
            onInput(v);
          }}
          value={value}
          placeholder={placeholder}
          aria-describedby={helpText ? helpTextId : undefined}
          css={{
            padding: '6px 8px',
            border: 'none',
            font: 'inherit',
            width: '100%',
            resize: 'vertical',

            '&:focus': {
              outline: 'none',
            },
          }}
          {...attrs}
        />
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
