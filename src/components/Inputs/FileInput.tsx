import React, { useRef, useState } from 'react';

import Button from './Button';
import CloseIcon from 'mdi-react/CloseIcon';

export interface FileInputProps<Multiselect extends boolean> {
  label?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  variant?: 'normal' | 'danger';
  multiselect?: Multiselect;
  /**
   * `null` if the user cancels the file selection dialog.
   *
   * Return `false` to mark input as invalid to allow the state to reset.
   *
   * You **cannot** return `false` when the parameter is `null`.
   */
  onInput: Multiselect extends true ? (file: null | File[]) => false | void : (file: null | File) => false | void;
}

export default function FileInput<Multiselect extends boolean = false>({
  className,
  loading = false,
  disabled,
  icon,
  variant,
  label,
  multiselect,
  onInput,
}: FileInputProps<Multiselect>) {
  const [selectedFile, setSelectedFile] = useState<File | File[] | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const defaultLabel = multiselect ? 'Select files' : 'Select file';
  let selectedLabel: React.ReactNode | null = null;

  if (selectedFile) {
    if (Array.isArray(selectedFile)) {
      if (selectedFile.length > 1) {
        selectedLabel = `${selectedFile.length} files selected`;
      } else if (selectedFile.length === 1) {
        selectedLabel = selectedFile[0].name;
      }
    } else {
      selectedLabel = selectedFile.name;
    }

    selectedLabel = <span className="monospace">{selectedLabel}</span>;
  }

  return (
    <div className={className} css={{ display: 'flex', justifyContent: 'center' }}>
      <Button
        disabled={disabled}
        loading={loading}
        icon={icon}
        variant={variant}
        onClick={() => {
          fileInput.current?.click();
        }}
      >
        {selectedLabel ?? (label === undefined ? defaultLabel : label)}
      </Button>

      {selectedFile && (
        <Button
          css={{ padding: 16, borderLeft: '2px solid transparent', backgroundClip: 'padding-box' }}
          onClick={() => {
            setSelectedFile(null);
            onInput(null);
          }}
          aria-label="Clear selected file"
          disabled={disabled}
        >
          <CloseIcon />
        </Button>
      )}

      {/* Invisible file input */}
      <input
        ref={fileInput}
        type="file"
        hidden
        multiple={multiselect}
        onInput={(e) => {
          const inp = e.target as HTMLInputElement;

          if (inp.files) {
            if (multiselect) {
              const files = Array.from(inp.files);
              const valid = onInput(files as any);

              if (valid === false) {
                setSelectedFile(null);
              } else {
                setSelectedFile(files);
              }
            } else {
              const file = inp.files[0];
              const valid = onInput(file as any);

              if (valid === false) {
                setSelectedFile(null);
              } else {
                setSelectedFile(file);
              }
            }
          } else {
            setSelectedFile(null);
            onInput(null);
          }
        }}
      />
    </div>
  );
}
