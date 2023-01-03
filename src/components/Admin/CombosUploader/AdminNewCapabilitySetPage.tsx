import { useEffect, useState } from 'react';

import { SEO } from '@components/SEO';
import Hero from '@components/Design/Hero';
import Section from '@components/Design/Section';
import Breadcrumbs from '@components/Design/Breadcrumbs';
import AdminAuthDetailsEntry from '@components/Admin/AdminAuthDetailsEntry';
import Button from '@components/Inputs/Button';
import TextBox from '@components/Inputs/TextBox';

import { useApiStore } from '@api/ApiStoreProvider';
import AdminAuthDetailsAtom from '@atoms/AdminAuthDetailsAtom';

import { useRecoilValue } from 'recoil';
import { enqueueSnackbar } from 'notistack';
import { HeadFC, navigate } from 'gatsby';
import { useLoadDevice } from '@hooks/useLoadDevice';
import { RouteComponentProps } from '@gatsbyjs/reach-router';
import DeviceFirmware from '@api/Models/DeviceFirmware';
import CapabilitySet from '@api/Models/CapabilitySet';
import Model from '@api/Model';

function isValidPlmn(plmn: string | null): boolean {
  if (plmn === null) return true;

  return plmn.match(/^[0-9]{3}-[0-9]{2,3}$/) !== null;
}

function isValidData(attrs: FormAttributeData | undefined): attrs is FormAttributeData {
  if (!attrs) return false;

  if (!attrs.description?.trim() || (!attrs.plmn && isValidPlmn(attrs.plmn))) return false;

  return true;
}

export interface AdminNewCapabilitySetPageProps extends RouteComponentProps {
  deviceUuid?: string;
  firmwareUuid?: string;
}

interface FormAttributeData {
  description: string;
  plmn: string;
}

export default function AdminNewCapabilitySetPage({ deviceUuid, firmwareUuid }: AdminNewCapabilitySetPageProps) {
  const store = useApiStore();

  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [formAttributeData, setFormAttributeData] = useState<FormAttributeData>({
    description: '',
    plmn: '',
  });
  const { device, loadingState, error, forceDataReload } = useLoadDevice(deviceUuid ?? '', [
    'modem',
    'deviceFirmwares',
    'deviceFirmwares.capabilitySets',
  ]);
  const firmware = store.getFirstBy<DeviceFirmware>('device-firmwares', 'uuid', firmwareUuid ?? '');

  const adminAuthDetails = useRecoilValue(AdminAuthDetailsAtom);

  const isValidFw = device && firmware && (device?.deviceFirmwares() || []).some((fw) => fw?.uuid() === firmware.uuid());

  useEffect(() => {
    if (!firmwareUuid) {
      if (!deviceUuid) {
        navigate(`/admin/upload`);
        return;
      }

      navigate(`/admin/upload/${deviceUuid}`);
      return;
    }
  }, []);

  useEffect(() => {
    if (!isValidFw && loadingState === 'loaded') {
      navigate(`/admin/upload/${deviceUuid}`);
    }
  }, [isValidFw, loadingState, deviceUuid]);

  useEffect(() => {
    if (loadingState === 'error') {
      enqueueSnackbar('Error loading device data from server', { variant: 'error' });
      navigate(`/admin/upload`);
    }
  }, [loadingState]);

  return (
    <>
      <Hero firstElement>
        <h1 className="text-shout">Admin &mdash; New capability set</h1>
      </Hero>

      <Breadcrumbs
        data={[
          {
            t: 'Home',
            url: `/`,
          },
          {
            t: 'Admin',
            url: `/admin`,
          },
          {
            t: 'Upload',
            url: `/admin/upload`,
          },
          {
            t: device?.deviceName() ?? 'Loading device...',
            url: `/admin/upload/${deviceUuid}`,
          },
          {
            t: firmware?.name() ?? 'Loading device...',
            url: `/admin/upload/${deviceUuid}/${firmwareUuid}`,
          },
          {
            t: 'New capability set',
            url: `/admin/upload/${deviceUuid}/${firmwareUuid}/new`,
          },
        ]}
      />

      <AdminAuthDetailsEntry sectionProps={{ darker: false }} />

      <Section darker>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setFormSubmitting(true);

            if (!isValidPlmn(formAttributeData.plmn || null)) {
              enqueueSnackbar('Invalid PLMN: must be blank or in format "MCC-MNC"', { variant: 'error' });
              setFormSubmitting(false);
              return;
            }

            if (!isValidData(formAttributeData)) {
              alert('Invalid data!');
              setFormSubmitting(false);
              return;
            }

            if (!firmware) {
              enqueueSnackbar('Missing linked firmware', { variant: 'error' });
              setFormSubmitting(false);
              return;
            }

            const newModem = new CapabilitySet(null, store);

            newModem
              .saveData<CapabilitySet>(
                {
                  attributes: {
                    description: formAttributeData.description,
                    plmn: formAttributeData.plmn || null,
                  },
                  relationships: {
                    deviceFirmware: { data: Model.getIdentifier(firmware) },
                  },
                },
                adminAuthDetails.token
              )
              .then((response) => {
                if (!response) {
                  enqueueSnackbar('Failed to create capability set', { variant: 'error' });
                  setFormSubmitting(false);
                  return;
                }

                enqueueSnackbar('Successfully created capability set. Redirecting to upload page...', { variant: 'success' });
                navigate(`/admin/upload/${deviceUuid}/${firmwareUuid}/${response.uuid()}`);
              })
              .catch(() => {
                enqueueSnackbar('Failed to create capability set (network error)', { variant: 'error' });
                setFormSubmitting(false);
              });
          }}
          css={{ display: 'flex', flexDirection: 'column', gap: 32 }}
        >
          <div css={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 className="text-louder">Attributes</h3>

            <TextBox
              value={formAttributeData?.description}
              disabled={formSubmitting}
              label="Description"
              onInput={(val) => {
                setFormAttributeData((v) => ({ ...v, description: val }));
              }}
              helpText="Description of the capability set (e.g., Hardware or EE UK or T-Mobile USA)."
            />

            <TextBox
              value={formAttributeData?.plmn}
              disabled={formSubmitting}
              label="Carrier PLMN (optional)"
              onInput={(val) => {
                setFormAttributeData((v) => ({ ...v, plmn: val }));
              }}
              helpText="Hyphen-separated PLMN (e.g., 234-10 for O2 UK). Leave blank if not appropriate."
            />
          </div>

          <Button type="submit" css={{ alignSelf: 'center' }} disabled={!isValidData(formAttributeData) || formSubmitting}>
            Create modem
          </Button>
        </form>
      </Section>
    </>
  );
}

export const Head: HeadFC = () => <SEO pageName="Create new modem"></SEO>;
