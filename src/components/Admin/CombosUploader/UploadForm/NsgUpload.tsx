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

export interface NsgUploadProps {
  device: Device;
  capabilitySet: CapabilitySet;
}

interface NsgFormOptions {
  eutraIsFile: boolean;
  eutraNrIsFile: boolean;
  nrIsFile: boolean;
}

interface NsgFormState {
  eutra: string | File | null;
  eutraNr: string | File | null;
  nr: string | File | null;
}

export function NsgUpload({ capabilitySet, device }: NsgUploadProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [submitError, setSubmitError] = useState<null | { status: number; responseText: string }>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formState, setFormState] = useState<NsgFormState>({ eutra: '', eutraNr: '', nr: '' });
  const adminAuth = useRecoilValue(AdminAuthDetailsAtom);
  const [formOptions, setFormOptions] = useStateWithLocalStorage<NsgFormOptions>('admin/combos-upload/nsg-form-options', {
    eutraIsFile: false,
    eutraNrIsFile: false,
    nrIsFile: false,
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (isSubmitting) return;

      setIsSubmitting(true);
      setSubmitError(null);

      const formData = new FormData();

      // EUTRA
      if (formOptions.eutraIsFile) {
        if (formState.eutra instanceof File) {
          formData.append('eutraLog', formState.eutra);
        }
      } else {
        if (typeof formState.eutra !== 'string') {
          alert("Error: EUTRA data should be string but isn't!");
          return;
        }

        const data = formState.eutra.trim();
        if (data) formData.append('eutraLog', data);
      }

      // Log type
      formData.append('logFormat', 'nsg');

      // Device/CapSet info
      formData.append('deviceId', device.id()!);
      formData.append('capabilitySetId', capabilitySet.id()!);

      // EUTRA-NR
      if (formOptions.eutraNrIsFile) {
        if (formState.eutraNr instanceof File) {
          formData.append('eutranrLog', formState.eutraNr);
        }
      } else {
        if (typeof formState.eutraNr !== 'string') {
          alert("Error: EUTRA-NR data should be string but isn't!");
          return;
        }

        const data = formState.eutraNr.trim();
        if (data) formData.append('eutranrLog', data);
      }

      // NR
      if (formOptions.nrIsFile) {
        if (formState.nr instanceof File) {
          formData.append('nrLog', formState.nr);
        }
      } else {
        if (typeof formState.nr !== 'string') {
          alert("Error: NR data should be string but isn't!");
          return;
        }

        const data = formState.nr.trim();
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
          value={formOptions.eutraIsFile ? 'file' : ''}
          onChange={(value) => {
            const isFile = value === 'file';
            setFormOptions({ ...formOptions, eutraIsFile: isFile });
            setFormState({ ...formState, eutra: isFile ? null : '' });
          }}
          groupLabel="EUTRA input"
          options={[
            { label: 'Text', value: '' },
            { label: 'File', value: 'file' },
          ]}
        />

        <FormField>
          {formOptions.eutraIsFile ? (
            <>
              <FileInput
                disabled={isSubmitting}
                css={{ margin: 'auto' }}
                label="Select EUTRA capability response file"
                icon={<UploadIcon />}
                onInput={(file) => {
                  if (file) setFormState({ ...formState, eutra: file });
                }}
              />
            </>
          ) : (
            <TextArea
              disabled={isSubmitting}
              value={typeof formState.eutra === 'string' ? formState.eutra : ''}
              onInput={(value) => setFormState({ ...formState, eutra: value })}
              label="EUTRA capability response"
              helpText="Signalling message from UE to network, where rat-Type: eutra."
            />
          )}
        </FormField>
      </FormSection>

      {/* File/Text EUTRA-NR */}
      <FormSection>
        <RadioButtonGroup
          disabled={isSubmitting}
          value={formOptions.eutraNrIsFile ? 'file' : ''}
          onChange={(value) => {
            const isFile = value === 'file';
            setFormOptions({ ...formOptions, eutraNrIsFile: isFile });
            setFormState({ ...formState, eutraNr: isFile ? null : '' });
          }}
          groupLabel="EUTRA-NR input"
          options={[
            { label: 'Text', value: '' },
            { label: 'File', value: 'file' },
          ]}
        />

        <FormField>
          {formOptions.eutraNrIsFile ? (
            <>
              <FileInput
                disabled={isSubmitting}
                css={{ margin: 'auto' }}
                label="Select EUTRA-NR capability response file"
                icon={<UploadIcon />}
                onInput={(file) => {
                  if (file) setFormState({ ...formState, eutraNr: file });
                }}
              />
            </>
          ) : (
            <TextArea
              disabled={isSubmitting}
              value={typeof formState.eutraNr === 'string' ? formState.eutraNr : ''}
              onInput={(value) => setFormState({ ...formState, eutraNr: value })}
              label="EUTRA-NR capability response"
              helpText="Signalling message from UE to network, where rat-Type: eutra-nr."
            />
          )}
        </FormField>
      </FormSection>

      {/* File/Text NR */}
      <FormSection>
        <RadioButtonGroup
          disabled={isSubmitting}
          value={formOptions.nrIsFile ? 'file' : ''}
          onChange={(value) => {
            const isFile = value === 'file';
            setFormOptions({ ...formOptions, nrIsFile: isFile });
            setFormState({ ...formState, nr: isFile ? null : '' });
          }}
          groupLabel="NR input"
          options={[
            { label: 'Text', value: '' },
            { label: 'File', value: 'file' },
          ]}
        />

        <FormField>
          {formOptions.nrIsFile ? (
            <>
              <FileInput
                disabled={isSubmitting}
                css={{ margin: 'auto' }}
                label="Select NR capability response file"
                icon={<UploadIcon />}
                onInput={(file) => {
                  if (file) setFormState({ ...formState, nr: file });
                }}
              />
            </>
          ) : (
            <TextArea
              disabled={isSubmitting}
              value={typeof formState.nr === 'string' ? formState.nr : ''}
              onInput={(value) => setFormState({ ...formState, nr: value })}
              label="NR capability response"
              helpText="Signalling message from UE to network, where rat-Type: nr."
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
