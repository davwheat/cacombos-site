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
  const [formError, setFormError] = useState<React.ReactNode>(null);
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();

  const showError = useCallback(
    (message: string) => {
      enqueueSnackbar(message, { variant: 'error' });
      setFormError(message);
    },
    [enqueueSnackbar, setFormError]
  );

  const hideError = useCallback(() => {
    setFormError(null);
  }, [setFormError]);

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

        hideError();
        setFormSubmitting(true);

        const formData = new FormData();
        formData.append('fromUser', formState.email);
        formData.append('deviceName', formState.deviceName);
        formData.append('deviceModel', formState.deviceModel);
        formData.append('deviceFirmware', formState.deviceFirmware);
        formData.append('comment', formState.comment);
        if (formState.log) formData.append('log', formState.log);
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
                return;
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
        <p className="text-speak">
          Some device logs may contain sensitive information, such as device information, IMEIs, SIM ICCIDs, phone numbers, location, and more.
        </p>
        <p className="text-speak">
          When you submit your device log to this form, it will be sent securely to our site administrator. No logs are kept for longer than is needed
          to process them, and are deleted after they are processed and uploaded (or deemed unusable).
        </p>
        <p className="text-speak">
          The anonymous capability data from any submitted files will be stored to allow them to be reprocessed in the future to allow more data to be
          extracted or to fix issues with previously processed data.
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

      {formError && (
        <MinorAlert
          coloredBackground
          color="primaryRed"
          heading="Error"
          css={{
            marginTop: 16,
          }}
        >
          <p className="text-speak">{formError}</p>
        </MinorAlert>
      )}

      <Button type="submit" css={{ marginTop: 24 }} loading={formSubmitting}>
        Submit form
      </Button>
    </form>
  );
}
