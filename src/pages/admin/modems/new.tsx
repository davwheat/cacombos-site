import { useState } from 'react';

import { SEO } from '@components/SEO';
import Layout from '@components/Design/Layout';
import Hero from '@components/Design/Hero';
import Section from '@components/Design/Section';
import Breadcrumbs from '@components/Design/Breadcrumbs';
import AdminAuthDetailsEntry from '@components/Admin/AdminAuthDetailsEntry';
import Button from '@components/Inputs/Button';
import TextBox from '@components/Inputs/TextBox';

import { useApiStore } from '@api/ApiStoreProvider';
import AdminAuthDetailsAtom from '@atoms/AdminAuthDetailsAtom';
import Modem from '@api/Models/Modem';

import { useRecoilValue } from 'recoil';
import { enqueueSnackbar } from 'notistack';
import { HeadFC, navigate, PageProps } from 'gatsby';

function isValidData(attrs: FormAttributeData | undefined): attrs is FormAttributeData {
  if (!attrs) return false;

  if (!attrs.name?.trim()) return false;

  return true;
}

interface FormAttributeData {
  name: string;
}

export default function AdminNewModemPage({ location }: PageProps) {
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [formAttributeData, setFormAttributeData] = useState<FormAttributeData | undefined>();
  const adminAuthDetails = useRecoilValue(AdminAuthDetailsAtom);
  const store = useApiStore();

  return (
    <Layout location={location}>
      <Hero firstElement>
        <h1 className="text-shout">Admin &mdash; New modem</h1>
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
            t: 'Manage modems',
            url: `/admin/modems`,
          },
          {
            t: `New modem`,
            url: `/admin/modems/new`,
          },
        ]}
      />

      <AdminAuthDetailsEntry sectionProps={{ darker: false }} />

      <Section darker>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setFormSubmitting(true);

            if (!isValidData(formAttributeData)) {
              alert('Invalid data!');
              setFormSubmitting(false);
              return;
            }

            const newModem = new Modem(null, store);

            newModem
              .saveData<Modem>(
                {
                  attributes: {
                    name: formAttributeData.name,
                  },
                },
                adminAuthDetails.token
              )
              .then((response) => {
                if (!response) {
                  enqueueSnackbar('Failed to create modem', { variant: 'error' });
                  setFormSubmitting(false);
                  return;
                }

                enqueueSnackbar('Successfully created modem. Redirecting to edit page...', { variant: 'success' });
                navigate(`/admin/modems/edit/${response.uuid()}`);
              })
              .catch(() => {
                enqueueSnackbar('Failed to create modem (network error)', { variant: 'error' });
                setFormSubmitting(false);
              });
          }}
          css={{ display: 'flex', flexDirection: 'column', gap: 32 }}
        >
          <div css={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 className="text-louder">Attributes</h3>

            <TextBox
              value={formAttributeData?.name}
              disabled={formSubmitting}
              label="Modem name"
              onInput={(val) => {
                setFormAttributeData((v) => ({ ...v!, name: val }));
              }}
              helpText="The name of the modem (e.g., Shannon 5100 or Snapdragon X65)."
            />
          </div>

          <Button type="submit" css={{ alignSelf: 'center' }} disabled={!isValidData(formAttributeData) || formSubmitting}>
            Create modem
          </Button>
        </form>
      </Section>
    </Layout>
  );
}

export const Head: HeadFC = () => <SEO pageName="Create new modem"></SEO>;
