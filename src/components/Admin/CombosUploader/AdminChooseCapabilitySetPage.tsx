import { useEffect } from 'react';

import Section from '@components/Design/Section';
import Hero from '@components/Design/Hero';
import Breadcrumbs from '@components/Design/Breadcrumbs';
import Link from '@components/Links/Link';
import LinkButton from '@components/Inputs/LinkButton';
import AdminAuthDetailsEntry from '../AdminAuthDetailsEntry';

import { useLoadDevice } from '@hooks/useLoadDevice';
import { useApiStore } from '@api/ApiStoreProvider';
import AdminAuthDetailsAtom from '@atoms/AdminAuthDetailsAtom';
import { navigate } from 'gatsby';
import { useSnackbar } from 'notistack';
import { useRecoilValue } from 'recoil';

import type { RouteComponentProps } from '@gatsbyjs/reach-router';
import type DeviceFirmware from '@api/Models/DeviceFirmware';
import type CapabilitySet from '@api/Models/CapabilitySet';

export interface AdminUploadCombosPageProps extends RouteComponentProps {
  deviceUuid?: string;
  firmwareUuid?: string;
}

export default function AdminUploadCombosPage({ deviceUuid, firmwareUuid }: AdminUploadCombosPageProps) {
  const store = useApiStore();
  const { device, loadingState, error, forceDataReload } = useLoadDevice(deviceUuid ?? '', [
    'modem',
    'deviceFirmwares',
    'deviceFirmwares.capabilitySets',
  ]);
  const firmware = store.getFirstBy<DeviceFirmware>('device-firmwares', 'uuid', firmwareUuid ?? '');
  const adminAuthDetails = useRecoilValue(AdminAuthDetailsAtom);
  const { enqueueSnackbar } = useSnackbar();

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
        <h1 className="text-shout">Upload combos</h1>
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
        ]}
      />

      <AdminAuthDetailsEntry sectionProps={{ darker: false }} />

      <Section>
        <div css={{ maxWidth: 720, margin: 'auto' }}>
          <h2 className="text-louder">All capability sets</h2>
          <p className="text-speak">
            You should only overwrite combos in an existing capability set if an import has failed. It's likely you should really be creating a new
            device firmware and/or a new capability set instead.
          </p>
          <p className="text-speak-up">To delete a capability set, you must have an admin-level token, or greater.</p>
        </div>

        <table
          css={{
            width: '100%',
            borderCollapse: 'collapse',

            '& td, & th': {
              padding: '4px 8px',
            },
          }}
        >
          <thead
            css={{
              fontWeight: 'bold',
              textAlign: 'left',
              '& th': {
                borderBottom: '2px solid black',
              },
            }}
          >
            <tr>
              <th>Description</th>
              <th>PLMN</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody
            css={{
              '& tr': {
                '&:hover': {
                  td: {
                    background: '#f5f5f5',
                  },
                },
              },
              '& td': {
                borderBottom: '1px solid #ddd',
              },
            }}
          >
            {firmware?.capabilitySets() &&
              (firmware?.capabilitySets() as CapabilitySet[]).map((capSet) => (
                <tr key={capSet.uuid()}>
                  <td>{capSet.description()}</td>
                  <td>{capSet.plmn() ?? 'N/A'}</td>
                  <td>
                    <div css={{ display: 'flex', gap: 12 }}>
                      <Link href={`/admin/upload/${deviceUuid}/${firmwareUuid}/${capSet.uuid()}`}>Upload combos</Link>
                      <LinkButton
                        onClick={() => {
                          const confirmation = confirm(
                            'Are you sure you want to delete this capability set? You will lose all combos that were attached to this capset.'
                          );

                          if (!confirmation) return;

                          capSet
                            .delete(adminAuthDetails.token)
                            .then((resp) => {
                              if (resp) enqueueSnackbar('Capability set deleted', { variant: 'success' });
                              else enqueueSnackbar('Failed to delete capability set', { variant: 'error' });
                            })
                            .catch((e) => {
                              enqueueSnackbar(`Failed to delete capability set: fetch error`, { variant: 'error' });
                            })
                            .finally(() => {
                              forceDataReload();
                            });
                        }}
                      >
                        Delete
                      </LinkButton>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Section>
    </>
  );
}
