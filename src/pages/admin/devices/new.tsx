import { useState } from 'react';

import { SEO } from '@components/SEO';
import Layout from '@components/Design/Layout';
import Hero from '@components/Design/Hero';
import Section from '@components/Design/Section';
import Breadcrumbs from '@components/Design/Breadcrumbs';
import AdminAuthDetailsEntry from '@components/Admin/AdminAuthDetailsEntry';
import Button from '@components/Inputs/Button';
import DateSelect from '@components/Inputs/DateSelect';
import ModemDropdown from '@components/Admin/ModemDropdown';
import TextBox from '@components/Inputs/TextBox';

import Device from '@api/Models/Device';
import { useApiStore } from '@api/ApiStoreProvider';
import AdminAuthDetailsAtom from '@atoms/AdminAuthDetailsAtom';

import { useRecoilValue } from 'recoil';
import { enqueueSnackbar } from 'notistack';
import { HeadFC, navigate, PageProps } from 'gatsby';

function isValidData(attrs: FormAttributeData | undefined): attrs is FormAttributeData {
  if (!attrs) return false;

  if (!attrs.deviceName || !attrs.modelName || !attrs.modemId || !attrs.releaseDate) return false;

  return true;
}

interface FormAttributeData {
  manufacturer: string;
  deviceName: string;
  modelName: string;
  modemId: string;
  releaseDate: Date;
}

export default function AdminNewDevicePage({ location }: PageProps) {
  const [formAttributeData, setFormAttributeData] = useState<FormAttributeData | undefined>();
  const adminAuthDetails = useRecoilValue(AdminAuthDetailsAtom);
  const store = useApiStore();

  return (
    <Layout location={location}>
      <Hero firstElement>
        <h1 className="text-shout">Admin &mdash; New device</h1>
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
            t: 'Manage devices',
            url: `/admin/devices`,
          },
          {
            t: `New device`,
            url: `/admin/devices/new`,
          },
        ]}
      />

      <AdminAuthDetailsEntry sectionProps={{ darker: false }} />

      <Section darker>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (!isValidData(formAttributeData)) {
              alert('Invalid data!');
              return;
            }

            const newDevice = new Device(null, store);

            newDevice
              .saveData<Device>(
                {
                  attributes: {
                    manufacturer: formAttributeData.manufacturer,
                    deviceName: formAttributeData.deviceName,
                    modelName: formAttributeData.modelName,
                    releaseDate: formAttributeData.releaseDate,
                  },
                  relationships: {
                    modem: {
                      data: {
                        id: formAttributeData.modemId,
                        type: 'modems',
                      },
                    },
                  },
                },
                adminAuthDetails.token
              )
              .then((response) => {
                if (!response) {
                  enqueueSnackbar('Failed to create device', { variant: 'error' });
                  return;
                }

                enqueueSnackbar('Successfully created device. Redirecting to edit page...', { variant: 'success' });
                navigate(`/admin/devices/edit/${response.uuid()}`);
              });
          }}
          css={{ display: 'flex', flexDirection: 'column', gap: 32 }}
        >
          <div css={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 className="text-louder">Attributes</h3>

            <TextBox
              value={formAttributeData?.manufacturer}
              label="Device manufacturer"
              onInput={(val) => {
                setFormAttributeData((v) => ({ ...v!, manufacturer: val }));
              }}
              helpText="The manufacturer of the device (e.g., Google/Apple/Samsung)."
            />

            <TextBox
              value={formAttributeData?.deviceName}
              label="Device name"
              onInput={(val) => {
                setFormAttributeData((v) => ({ ...v!, deviceName: val }));
              }}
              helpText="The name of the device. Can include region identifier if needed (e.g., Europe/Global/NA)."
            />

            <TextBox
              value={formAttributeData?.modelName}
              label="Model name"
              onInput={(val) => {
                setFormAttributeData((v) => ({ ...v!, modelName: val }));
              }}
              helpText="The device's model name/number."
            />

            <ModemDropdown modemId={formAttributeData?.modemId!} onSelectModem={(modemId) => setFormAttributeData((v) => ({ ...v!, modemId }))} />

            <DateSelect
              label="Release date"
              onInput={(val) => {
                setFormAttributeData((v) => ({ ...v!, releaseDate: val }));
              }}
              value={formAttributeData?.releaseDate!}
            />
          </div>

          <Button type="submit" css={{ alignSelf: 'center' }} disabled={!isValidData(formAttributeData)}>
            Save changes
          </Button>
        </form>
      </Section>
    </Layout>
  );
}

export const Head: HeadFC = () => <SEO pageName="Admin"></SEO>;
