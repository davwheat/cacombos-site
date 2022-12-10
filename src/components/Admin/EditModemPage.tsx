import React, { useEffect, useState } from 'react';

import Button from '@components/Inputs/Button';
import Hero from '@components/Design/Hero';
import Link from '@components/Links/Link';
import LoadingSpinner from '@components/LoadingSpinner';
import Section from '@components/Design/Section';
import TextBox from '@components/Inputs/TextBox';
import EyeIcon from 'mdi-react/EyeOutlineIcon';
import EyeSlashIcon from 'mdi-react/EyeOffOutlineIcon';

import Colors from '@data/colors.json';
import AdminAuthDetailsAtom from '@atoms/AdminAuthDetailsAtom';

import { useApiStore } from '../../api/ApiStoreProvider';
import { useRecoilState } from 'recoil';
import { useSnackbar } from 'notistack';

import type { RouteComponentProps } from '@gatsbyjs/reach-router';
import type Modem from '../../api/Models/Modem';

export const ModemPageContext = React.createContext<Modem | null>(null);

export interface ModemPageProps extends RouteComponentProps {
  uuid?: string;
}

interface FormAttributeData {
  name: string;
}

/**
 * See https://jsonapi.org/ext/atomic/ for more information on the atomic extension.
 */
function assembleAtomicRequest(type: 'update' | 'add', currentModem: Modem | null, newAttributes: FormAttributeData) {
  const { name } = newAttributes;

  if (type === 'update') {
    if (!currentModem) {
      alert('Cannot update a modem without a modem');

      return {
        'atomic:operations': [],
      };
    }

    return {
      'atomic:operations': [
        {
          op: 'update',
          data: {
            type: 'modems',
            id: currentModem!.id(),
            attributes: {
              name,
            },
          },
        },
      ],
    };
  } else if (type === 'add') {
    return {
      'atomic:operations': [
        {
          op: 'add',
          data: {
            type: 'modems',
            attributes: {
              name,
            },
          },
        },
      ],
    };
  }

  alert('Invalid operation');

  return {
    'atomic:operations': [],
  };
}

function isValidData(data: FormAttributeData | undefined) {
  if (!data) {
    return false;
  }

  const { name } = data;

  if (name.trim().length === 0) {
    alert('Please enter a name for the modem');

    return false;
  }
}

export default function EditDevicePage({ uuid }: ModemPageProps) {
  const store = useApiStore();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [showToken, setShowToken] = useState(false);
  const [apiAuthDetails, setAdminAuthDetails] = useRecoilState(AdminAuthDetailsAtom);
  const [modem, setModem] = useState<Modem | undefined>(store.getFirstBy<Modem>('modems', 'uuid', uuid ?? ''));
  const [error, setError] = useState<null | any>(null);
  const [isModemLoading, setIsModemLoading] = useState(!modem);

  const [formAttributeData, setFormAttributeData] = useState<FormAttributeData | undefined>();

  async function loadModem() {
    setIsModemLoading(true);

    const data = await store
      .find<Modem[]>('modems', {
        filter: {
          uuid: uuid ?? '',
        },
        page: {
          limit: 1,
        },
      })
      .catch((err) => {
        setError(err);
      });

    setIsModemLoading(false);
    setModem(data?.[0]);

    document.title = modem?.name() ? `Editing ${modem.name()}` : 'Not found';
  }

  useEffect(() => {
    if (isModemLoading) {
      loadModem();
    }
  }, []);

  if (error) {
    return (
      <>
        <Hero color={Colors.primaryRed} firstElement>
          <h1 className="text-shout">Oops...</h1>
        </Hero>
        <Section>
          <p className="text-speak" css={{ textAlign: 'center', marginTop: 16 }}>
            Something went wrong when fetching data for this modem. Please try again later.
          </p>
        </Section>
      </>
    );
  }

  if (!modem && isModemLoading) {
    return (
      <ModemPageContext.Provider value={null}>
        <Hero color={Colors.lightGrey} firstElement>
          <h1 className="text-shout">Loading...</h1>
        </Hero>
        <Section>
          <LoadingSpinner />
          <p className="text-speak" css={{ textAlign: 'center', marginTop: 16 }}>
            Just a moment...
          </p>
        </Section>
      </ModemPageContext.Provider>
    );
  }

  if (!modem) {
    return (
      <ModemPageContext.Provider value={null}>
        <Hero color={Colors.primaryRed} firstElement>
          <h1 className="text-shout">Oops...</h1>
        </Hero>
        <Section>
          <p className="text-speak">
            We couldn't find the modem you were looking for (<code className="code">{uuid}</code>).
          </p>
          <Link href="/admin/modems">Browse all modems</Link>
        </Section>
      </ModemPageContext.Provider>
    );
  }

  return (
    <ModemPageContext.Provider value={modem}>
      <Hero color={Colors.primaryBlue} firstElement>
        <h1 className="text-shout">Editing {modem.name()}</h1>
      </Hero>

      <Section darker usePadding>
        <h2 className="text-louder">Admin info</h2>

        <TextBox
          value={apiAuthDetails.token}
          onInput={(token) => {
            setAdminAuthDetails((v) => ({ ...v, token }));
          }}
          style={showToken ? {} : { fontFamily: 'sans-serif' }}
          label="Token"
          helpText="Enter your token. Without this, you cannot save changes. This will be saved and auto-filled next time you load the website. Do not enter this on a public computer."
          type={showToken ? 'text' : 'password'}
          endAdornment={
            <Button
              onClick={() => {
                setShowToken((v) => !v);
              }}
              css={{ padding: 0, width: 48, height: 36, alignItems: 'center', justifyContent: 'center' }}
            >
              {showToken ? <EyeIcon /> : <EyeSlashIcon />}
            </Button>
          }
        />
      </Section>

      <Section>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (!formAttributeData || !formAttributeData.name?.trim()) {
              alert('Invalid data!');
              return;
            }

            const body = assembleAtomicRequest('update', modem, formAttributeData);

            fetch(`${process.env.GATSBY_API_BASE_URL}/operations`, {
              method: 'POST',
              body: JSON.stringify(body),
              headers: {
                'Content-Type': 'application/vnd.api+json;ext="https://jsonapi.org/ext/atomic"',
                Accept: 'application/vnd.api+json;ext="https://jsonapi.org/ext/atomic"',
                'X-Auth-Token': apiAuthDetails.token,
              },
            })
              .then((resp) => {
                if (!resp.ok) {
                  switch (resp.status) {
                    case 401:
                    case 403:
                      enqueueSnackbar("You don't have permission to perform these changes.", { variant: 'error' });
                      return;

                    case 404:
                      enqueueSnackbar("One or more modems couldn't be found. Maybe someone else modified this modem while you were?", {
                        variant: 'error',
                      });
                      return;

                    default:
                      enqueueSnackbar('An error occurred while saving data. No changes have been made.', { variant: 'error' });
                      return;
                  }
                }

                // Saved successfully
                if (resp.status !== 204) {
                  resp.json().then((data) => {
                    console.log(data);

                    const results = data['atomic:results'];

                    results.forEach((result: any) => {
                      if (result === null) return;

                      store.pushPayload(result);
                    });
                  });
                }

                enqueueSnackbar('Changes saved successfully!', { variant: 'success' });

                setModem(undefined);
                setIsModemLoading(true);

                loadModem();
              })
              .catch((err) => {
                console.error(err);

                alert('An error occurred while saving data. No changes have been made.');
              });
          }}
          css={{ display: 'flex', flexDirection: 'column', gap: 32 }}
        >
          <div css={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 className="text-louder">Attributes</h3>

            <TextBox
              value={formAttributeData?.name}
              label="Modem name"
              onInput={(val) => {
                setFormAttributeData((v) => ({ ...v!, deviceName: val }));
              }}
            />
          </div>

          <Button type="submit" css={{ alignSelf: 'center' }} disabled={!isValidData(formAttributeData)}>
            Save changes
          </Button>
        </form>
      </Section>
    </ModemPageContext.Provider>
  );
}
