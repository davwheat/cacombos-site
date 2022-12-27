import { useRef } from 'react';

import RadioButton from './RadioButton';

import { nanoid } from 'nanoid';

export interface IRadioButtonGroupOption<T> {
  label: string;
  value: T;
}

export interface IRadioButtonGroupProps<T extends number | string> {
  className?: string;
  groupLabel: string;
  options: IRadioButtonGroupOption<T>[];
  onChange: (value: T) => void;
  value: T;
  disabled?: boolean;
}

export default function RadioButtonGroup<T extends string | number>({
  className,
  groupLabel,
  options,
  onChange,
  value,
  disabled = false,
}: IRadioButtonGroupProps<T>) {
  const { current: groupName } = useRef(nanoid());

  return (
    <fieldset
      className={className}
      css={{
        padding: '16px 24px',
        background: '#fff',

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',

        '& legend': {
          // Prevent browser rendering it as a fieldset legend
          float: 'left',
          marginBottom: 12,
          fontWeight: 'bold',
        },
      }}
    >
      <legend>{groupLabel}</legend>
      <span
        css={{
          '&::after': {
            display: 'block',
            content: '""',
            clear: 'both',
          },
        }}
      />

      <div
        css={{
          display: 'grid',
          gap: 12,
        }}
      >
        {options.map((option) => (
          <RadioButton
            disabled={disabled}
            name={groupName}
            key={option.value}
            label={option.label}
            checked={option.value === value}
            onChecked={() => {
              onChange(option.value);
            }}
          />
        ))}
      </div>
    </fieldset>
  );
}
