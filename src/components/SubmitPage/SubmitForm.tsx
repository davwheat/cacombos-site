import React, { useCallback, useState } from 'react';

import MinorAlert from '@components/Design/MinorAlert';
import Button from '@components/Inputs/Button';
import Checkbox from '@components/Inputs/Checkbox';
import FileInput from '@components/Inputs/FileInput';
import TextArea from '@components/Inputs/TextArea';
import TextBox from '@components/Inputs/TextBox';
import Link from '@components/Links/Link';

import { useSnackbar } from 'notistack';

interface SubmitFormState {
  email: string;
  deviceName: string;
  deviceModel: string;
  deviceFirmware: string;
  comment: string;
  log: File | null;
  privacyAgree: boolean;
}

export default function SubmitForm() {
  const [formState, setFormState] = useState<SubmitFormState>({
    email: '',
    deviceName: '',
    deviceModel: '',
    deviceFirmware: '',
    comment: '',
    log: null,
    privacyAgree: false,
  });
  const [formResult, setFormResult] = useState<null | { content: React.ReactNode; type: 'error' | 'success' }>(null);
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();

  const showError = useCallback(
    (message: string, messageShort?: string) => {
      enqueueSnackbar(messageShort ?? message, { variant: 'error' });
      setFormResult({ type: 'error', content: <>{message}</> });
    },
    [enqueueSnackbar, setFormResult]
  );

  const showSuccess = useCallback(
    (message: string, messageShort?: string) => {
      enqueueSnackbar(messageShort ?? message, { variant: 'success' });
      setFormResult({ type: 'success', content: <>{message}</> });
    },
    [enqueueSnackbar, setFormResult]
  );

  const hideFormResult = useCallback(() => {
    setFormResult(null);
  }, [setFormResult]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        if (!formState.privacyAgree) {
          showError('You must agree to the privacy policy to submit data.');
          return;
        }

        if (!formState.log && !formState.comment.trim()) {
          showError('You must provide a log file or comment.');
          return;
        }

        // Validation complete

        hideFormResult();
        setFormSubmitting(true);

        const formData = new FormData();
        formData.append('fromUser', formState.email);
        formData.append('deviceName', formState.deviceName);
        formData.append('deviceModel', formState.deviceModel);
        formData.append('deviceFirmware', formState.deviceFirmware);
        formData.append('comment', formState.comment);
        if (formState.log) formData.append('log', formState.log);

        const promise = fetch(`${process.env.GATSBY_API_ACTIONS_BASE_URL}/submit-combos`, {
          method: 'POST',
          body: formData,
        });

        promise
          .then((response) => {
            if (!response.ok) {
              const body = response.json();

              body
                .then((data) => {
                  showError(Object.values(data?.errors).join(' '));
                })
                .catch((e: Error | unknown) => {
                  showError(`An error occurred while submitting your data. Please try again later. (HTTP Error ${response.status})`);

                  if (e instanceof Error) {
                    setFormResult({
                      type: 'error',
                      content: (
                        <>
                          An error occurred while submitting your data. Please try again later. (HTTP Error {response.status})
                          <br />
                          <br />
                          Error: {e.message}
                        </>
                      ),
                    });
                  }
                });
            } else {
              // All ok!
              showSuccess(
                'Your submission has been received successfully. If you provided your email address, you will be contacted when your data has been processed and uploaded.',
                'Submitted data successfully'
              );
            }
          })
          .catch((e: Error | unknown) => {
            showError(
              'An network error occurred while submitting your data. Make sure your device has an internet connection. If it does, please try again later.'
            );
            if (e instanceof Error) {
              setFormResult({
                type: 'error',
                content: (
                  <>
                    An network error occurred while submitting your data. Make sure your device has an internet connection. If it does, please try
                    again later.
                    <br />
                    <br />
                    Error: {e.message}
                  </>
                ),
              });
            }
          })
          .finally(() => {
            setFormSubmitting(false);
          });
      }}
      css={{
        marginTop: 24,
      }}
    >
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateAreas: `
          'email email'
          'deviceName deviceModel'
          'deviceFirmware deviceFirmware'
          'log log'
          'comment comment'`,
          gap: 16,
        }}
      >
        <TextBox
          label="Your email (optional)"
          helpText="This will be used to contact you in relation to your submission"
          value={formState.email}
          disabled={formSubmitting}
          onInput={(val) => setFormState({ ...formState, email: val })}
          css={{ gridArea: 'email' }}
        />

        <TextBox
          label="Device name"
          helpText="The name of your device (e.g., Google Pixel 7 Pro)"
          value={formState.deviceName}
          disabled={formSubmitting}
          onInput={(val) => setFormState((s) => ({ ...s, deviceName: val }))}
          css={{ gridArea: 'deviceName' }}
        />

        <TextBox
          label="Device model"
          helpText="Your device's model number. Some devices have regional variants, so please submit the correct model."
          value={formState.deviceModel}
          disabled={formSubmitting}
          onInput={(val) => setFormState((s) => ({ ...s, deviceModel: val }))}
          css={{ gridArea: 'deviceModel' }}
        />

        <TextBox
          label="Device firmware"
          helpText="The firmware version of your device (e.g., QPR Beta 1)"
          value={formState.deviceFirmware}
          disabled={formSubmitting}
          onInput={(val) => setFormState((s) => ({ ...s, deviceFirmware: val }))}
          css={{ gridArea: 'deviceFirmware' }}
        />

        <div css={{ gridArea: 'log' }}>
          <p className="text-speak-up">Device log</p>
          <FileInput
            label="Upload your device log"
            disabled={formSubmitting}
            onInput={(val) => {
              if ((val?.size ?? 0) > 1024 * 1024 * 25) {
                showError('The log file must be smaller than 25 MB.');
                setFormState((s) => ({ ...s, log: null }));
                return false;
              }

              setFormState((s) => ({ ...s, log: val }));
            }}
          />
          <p className="text-whisper" css={{ marginTop: 8 }}>
            Maximum file size is 25 MB. If your file is larger than this, please use a file transfer service, like Google Drive,{' '}
            <Link href="https://wetransfer.com/">WeTransfer</Link> or <Link href="https://www.dropbox.com/transfer">Dropbox Transfer</Link> and place
            the link in the box below.
          </p>
        </div>

        <TextArea
          label="Additional info"
          helpText="Any additional information you'd like to provide (e.g., the device's carrier, any modifications made, any band locking, etc.)"
          value={formState.comment}
          disabled={formSubmitting}
          onInput={(val) => setFormState((s) => ({ ...s, comment: val }))}
          css={{ gridArea: 'comment' }}
        />
      </div>

      <MinorAlert color="primaryBlue" coloredBackground css={{ marginTop: 32 }} heading="Privacy information">
        <p className="text-speak">Some device logs may contain sensitive and personally identifiable information.</p>
        <p className="text-speak">
          When you submit your device log to this form, it will be sent securely to our site administrator. Logs are stored and used purely to
          retrieve device capability data and are never shared with third parties without your explicit consent.
        </p>
        <p className="text-speak">
          Any submitted files may be stored to allow them to be reprocessed in the future to extract additional data, or to fix issues with previously
          processed data.
        </p>
        <p className="text-speak">
          Under UK and EU GDPR, you have various rights surrounding your personal information. If you think you may wish to execise these rights in
          the future, please provide your email address, otherwise we will not be able to link your identity to any submissions and will be unable to
          process your request.
        </p>
        <p className="text-speak">
          <strong>
            For full details about how we store, handle and process your personal information, please read our{' '}
            <Link href="/privacy-policy">privacy policy</Link>.
          </strong>
        </p>
      </MinorAlert>

      <Checkbox
        label="I agree to the privacy information above"
        disabled={formSubmitting}
        css={{ marginTop: 16 }}
        checked={formState.privacyAgree}
        onChange={() => {
          setFormState((s) => ({ ...s, privacyAgree: !s.privacyAgree }));
        }}
      />

      {formResult && (
        <MinorAlert
          coloredBackground
          color={formResult.type === 'error' ? 'primaryRed' : 'green'}
          heading={formResult.type}
          css={{
            marginTop: 16,

            '& h3': {
              textTransform: 'capitalize',
            },
          }}
        >
          <p className="text-speak">{formResult.content}</p>
        </MinorAlert>
      )}

      <Button type="submit" css={{ marginTop: 24 }} loading={formSubmitting}>
        Submit form
      </Button>
    </form>
  );
}
