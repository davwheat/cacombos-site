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

export interface QualcommHexdumpUploadProps {
  device: Device;
  capabilitySet: CapabilitySet;
}

interface QualcommHexdumpFormOptions {
  B0CDIsFile: boolean;
  B826IsFile: boolean;
}

interface QualcommHexdumpFormState {
  B0CD: string | File | null;
  B826: string | File | null;
}

export function QualcommHexdumpUpload({ capabilitySet, device }: QualcommHexdumpUploadProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [submitError, setSubmitError] = useState<null | { status: number; responseText: string }>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formState, setFormState] = useState<QualcommHexdumpFormState>({ B0CD: '', B826: '' });
  const adminAuth = useRecoilValue(AdminAuthDetailsAtom);
  const [formOptions, setFormOptions] = useStateWithLocalStorage<QualcommHexdumpFormOptions>('admin/combos-upload/qualcomm-hexdump-form-options', {
    B0CDIsFile: false,
    B826IsFile: false,
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (isSubmitting) return;

      setIsSubmitting(true);
      setSubmitError(null);

      const formData = new FormData();

      // EUTRA
      if (formOptions.B0CDIsFile) {
        if (formState.B0CD instanceof File) {
          formData.append('eutraLog', formState.B0CD);
        }
      } else {
        if (typeof formState.B0CD !== 'string') {
          alert("Error: B0CD data should be string but isn't!");
          return;
        }

        const data = formState.B0CD.trim();
        if (data) formData.append('eutraLog', data);
      }

      // Log type
      formData.append('logFormat', 'qualcomm');

      // Device/CapSet info
      formData.append('deviceId', device.id()!);
      formData.append('capabilitySetId', capabilitySet.id()!);

      // NR
      if (formOptions.B826IsFile) {
        if (formState.B826 instanceof File) {
          formData.append('nrLog', formState.B826);
        }
      } else {
        if (typeof formState.B826 !== 'string') {
          alert("Error: B826 data should be string but isn't!");
          return;
        }

        const data = formState.B826.trim();
        if (data) formData.append('nrLog', data);
      }

      const promise = fetch(`${process.env.GATSBY_API_ACTIONS_BASE_URL}/parse-import-log`, {
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

      {/* File/Text EUTRA */}
      <FormSection>
        <RadioButtonGroup
          disabled={isSubmitting}
          value={formOptions.B0CDIsFile ? 'file' : ''}
          onChange={(value) => {
            const isFile = value === 'file';
            setFormOptions({ ...formOptions, B0CDIsFile: isFile });
            setFormState({ ...formState, B0CD: isFile ? null : '' });
          }}
          groupLabel="0xB0CD packet"
          options={[
            { label: 'Text', value: '' },
            { label: 'File', value: 'file' },
          ]}
        />

        <FormField>
          {formOptions.B0CDIsFile ? (
            <>
              <FileInput
                disabled={isSubmitting}
                css={{ margin: 'auto' }}
                label="Select 0xB826 packet hexdump"
                icon={<UploadIcon />}
                onInput={(file) => {
                  if (file) setFormState({ ...formState, B0CD: file });
                }}
              />
            </>
          ) : (
            <TextArea
              disabled={isSubmitting}
              value={typeof formState.B0CD === 'string' ? formState.B0CD : ''}
              onInput={(value) => setFormState({ ...formState, B0CD: value })}
              label="0xB0CD packet hexdump"
              helpText="QCAT hexdump output for a series of 0xB0CD packets"
              placeholder={`2023 Feb  1  17:25:43.808  [29]  0xB0CD  LTE RRC Supported CA Combos
...`}
            />
          )}
        </FormField>
      </FormSection>

      {/* File/Text NR */}
      <FormSection>
        <RadioButtonGroup
          disabled={isSubmitting}
          value={formOptions.B826IsFile ? 'file' : ''}
          onChange={(value) => {
            const isFile = value === 'file';
            setFormOptions({ ...formOptions, B826IsFile: isFile });
            setFormState({ ...formState, B826: isFile ? null : '' });
          }}
          groupLabel="0xB826 packet"
          options={[
            { label: 'Text', value: '' },
            { label: 'File', value: 'file' },
          ]}
        />

        <FormField>
          {formOptions.B826IsFile ? (
            <>
              <FileInput
                disabled={isSubmitting}
                css={{ margin: 'auto' }}
                label="Select 0xB826 packet hexdump"
                icon={<UploadIcon />}
                onInput={(file) => {
                  if (file) setFormState({ ...formState, B826: file });
                }}
              />
            </>
          ) : (
            <TextArea
              disabled={isSubmitting}
              value={typeof formState.B826 === 'string' ? formState.B826 : ''}
              onInput={(value) => setFormState({ ...formState, B826: value })}
              label="0xB826 packet hexdump"
              helpText="QCAT hexdump output for a series of 0xB0CD packets"
              placeholder={`2023 Feb  1  17:25:49.475  [9E]  0xB826  NR5G RRC Supported CA Combos
...`}
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
