import React, { useCallback, useState } from 'react';
import TextBox from '@components/Inputs/TextBox';
import RadioButtonGroup from '@components/Inputs/RadioButtonGroup';
import TextArea from '@components/Inputs/TextArea';
import FileInput from '@components/Inputs/FileInput';
import Button from '@components/Inputs/Button';
import MinorAlert from '@components/Design/MinorAlert';
import AdminAuthDetailsAtom from '@atoms/AdminAuthDetailsAtom';
import useStateWithLocalStorage from '@hooks/useStateWithLocalStorage';
import Colors from '@data/colors.json';

import { useRecoilValue } from 'recoil';
import { useSnackbar } from 'notistack';
import UploadIcon from 'mdi-react/CloudUploadOutlineIcon';

import type CapabilitySet from '@api/Models/CapabilitySet';
import type Device from '@api/Models/Device';

export interface ImportOnlyUploadProps {
  device: Device;
  capabilitySet: CapabilitySet;
}

interface ImportOnlyFormOptions {
  jsonDataIsFile: boolean;
}

interface ImportOnlyFormState {
  jsonData: string | File | null;
}

export function ImportOnlyUpload({ capabilitySet, device }: ImportOnlyUploadProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [submitError, setSubmitError] = useState<null | { status: number; responseText: string }>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formState, setFormState] = useState<ImportOnlyFormState>({ jsonData: '' });
  const adminAuth = useRecoilValue(AdminAuthDetailsAtom);
  const [formOptions, setFormOptions] = useStateWithLocalStorage<ImportOnlyFormOptions>('admin/combos-upload/import-json-form-options', {
    jsonDataIsFile: false,
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (isSubmitting) return;

      setIsSubmitting(true);
      setSubmitError(null);

      const formData = new FormData();

      // JSON data
      if (formOptions.jsonDataIsFile) {
        if (formState.jsonData instanceof File) {
          formData.append('jsonData', formState.jsonData);
        }
      } else {
        if (typeof formState.jsonData !== 'string') {
          alert("Error: data should be string but isn't!");
          return;
        }

        try {
          JSON.parse(formState.jsonData);
        } catch (e) {
          alert('Error: data is not valid JSON!');
          return;
        }

        const data = formState.jsonData.trim();
        if (data) formData.append('jsonData', data);
      }

      // Device/CapSet info
      formData.append('deviceId', device.id()!);
      formData.append('capabilitySetId', capabilitySet.id()!);

      const promise = fetch(`${process.env.GATSBY_API_ACTIONS_BASE_URL}/import-json`, {
        method: 'POST',
        headers: {
          // Content-Type is set automatically by the browser
          // https://muffinman.io/blog/uploading-files-using-fetch-multipart-form-data/
          'X-Auth-Token': adminAuth.token,
        },
        body: formData,
      });

      promise
        .then((response) => {
          if (!response.ok) {
            enqueueSnackbar('Failed to upload combos', { variant: 'error' });
            response.text().then((text) => setSubmitError({ status: response.status, responseText: text }));
            return;
          }

          enqueueSnackbar('Successfully uploaded combos to capability set', { variant: 'success' });
        })
        .catch(() => {
          enqueueSnackbar('HTTP request failed', { variant: 'error' });
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    },
    [isSubmitting, setIsSubmitting, capabilitySet, device, formOptions, formState, adminAuth, enqueueSnackbar, setSubmitError]
  );

  return (
    <form onSubmit={handleSubmit}>
      <FormField>
        <TextBox disabled label="Device" value={`${device.id()} - ${device.manufacturer()} ${device.deviceName()}`} onInput={() => {}} />
      </FormField>
      <FormField>
        <TextBox disabled label="Capability set" value={`${capabilitySet.id()} - ${capabilitySet.description()}`} onInput={() => {}} />
      </FormField>

      {/* File/Text JSON data */}
      <FormSection>
        <RadioButtonGroup
          disabled={isSubmitting}
          value={formOptions.jsonDataIsFile ? 'file' : ''}
          onChange={(value) => {
            const isFile = value === 'file';
            setFormOptions({ ...formOptions, jsonDataIsFile: isFile });
            setFormState({ ...formState, jsonData: isFile ? null : '' });
          }}
          groupLabel="JSON data input"
          options={[
            { label: 'Text', value: '' },
            { label: 'File', value: 'file' },
          ]}
        />

        <FormField>
          {formOptions.jsonDataIsFile ? (
            <>
              <FileInput
                disabled={isSubmitting}
                css={{ margin: 'auto' }}
                label="Select parsed JSON data file"
                icon={<UploadIcon />}
                onInput={(file) => {
                  if (file) setFormState({ ...formState, jsonData: file });
                }}
              />
            </>
          ) : (
            <TextArea
              disabled={isSubmitting}
              value={typeof formState.jsonData === 'string' ? formState.jsonData : ''}
              onInput={(value) => setFormState({ ...formState, jsonData: value })}
              label="Parsed JSON data"
              helpText="JSON data from Andrea's parser."
            />
          )}
        </FormField>
      </FormSection>

      <MinorAlert color="cautioningAmber" coloredBackground css={{ marginTop: 24 }} heading="Warning">
        <p className="text-speak">
          Once you begin the submission, your changes cannot be reverted. Please make sure this data is correct before continuing!
        </p>
        <p className="text-speak-up">Submitting data can take up to 2 minutes to complete. Please be patient!</p>
      </MinorAlert>

      <Button css={{ marginTop: 24 }} type="submit" loading={isSubmitting}>
        Submit data
      </Button>

      {submitError && (
        <MinorAlert color="primaryRed" coloredBackground css={{ marginTop: 24 }} heading={`Submission error ${submitError.status}`}>
          <p className="text-speak">Submission error debugging info is below.</p>
          <pre css={{ overflow: 'auto', paddingBottom: 8 }}>
            <code className="code">{submitError.responseText}</code>
          </pre>
        </MinorAlert>
      )}
    </form>
  );
}

function FormField({ children }: { children: React.ReactNode }) {
  return <div css={{ marginTop: 16 }}>{children}</div>;
}

function FormSection({ children }: { children: React.ReactNode }) {
  return <div css={{ marginTop: 32, padding: 16, background: Colors.lightGrey }}>{children}</div>;
}
