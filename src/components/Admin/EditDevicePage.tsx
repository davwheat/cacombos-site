import React, { useEffect, useState } from 'react';

import ModemDropdown from './ModemDropdown';
import Section from '@components/Design/Section';
import Link from '@components/Links/Link';
import LoadingSpinner from '@components/LoadingSpinner';
import Hero from '@components/Design/Hero';
import TextBox from '@components/Inputs/TextBox';
import Button from '@components/Inputs/Button';
import DateSelect from '@components/Inputs/DateSelect';
import Breadcrumbs from '@components/Design/Breadcrumbs';
import TrashIcon from 'mdi-react/TrashOutlineIcon';

import AdminAuthDetailsEntry from './AdminAuthDetailsEntry';
import Device from '@api/Models/Device';
import { useApiStore } from '@api/ApiStoreProvider';
import DeviceFirmware from '@api/Models/DeviceFirmware';
import Model from '@api/Model';
import AdminAuthDetailsAtom from '@atoms/AdminAuthDetailsAtom';
import Colors from '@data/colors.json';

import { useRecoilValue } from 'recoil';
import { useSnackbar } from 'notistack';

import type { RouteComponentProps } from '@gatsbyjs/reach-router';

export const DevicePageContext = React.createContext<Device | null>(null);

export interface DevicePageProps extends RouteComponentProps {
  uuid?: string;
}

function isDeviceBasicInfoLoaded(device?: Device): boolean {
  if (!device) return false;

  if ([device.modem()].includes(false)) return false;

  return true;
}

function isDeviceFirmwareCapSetsInfoLoaded(device?: Device): boolean {
  if (isDeviceBasicInfoLoaded(device) === false) return false;

  const fws = device!.deviceFirmwares();

  if (!fws) return false;

  if (fws.some((fw) => !fw)) return false;

  const cs = fws.map((fw) => fw!.capabilitySets()).flat();

  if (cs.some((c) => !c)) return false;

  return true;
}

interface FormAttributeData {
  manufacturer: string;
  deviceName: string;
  modelName: string;
  modemId: string;
  releaseDate: Date;
}

interface FormFirmwareData {
  existingFirmwareId?: string;
  firmwareName: string;
}

function isValidData(attrs: FormAttributeData | undefined, fws: FormFirmwareData[] | undefined): boolean {
  if (!attrs || !fws) return false;

  if (!attrs.manufacturer || !attrs.deviceName || !attrs.modelName || !attrs.modemId || !attrs.releaseDate) return false;

  if (fws.some((fw) => !fw.firmwareName)) return false;

  return true;
}

/**
 * See https://jsonapi.org/ext/atomic/ for more information on the atomic extension.
 */
function assembleAtomicRequest(currentDevice: Device, newAttributes: FormAttributeData, newFirmwares: FormFirmwareData[]) {
  const { manufacturer, deviceName, modelName, modemId, releaseDate } = newAttributes;

  const firmwaresToAdd = newFirmwares.filter((fw) => !fw.existingFirmwareId);
  const firmwaresToUpdate = newFirmwares.filter((fw) => fw.existingFirmwareId);
  const firmwaresToRemove = (currentDevice.deviceFirmwares() as DeviceFirmware[]).filter(
    (fw) => !newFirmwares.some((newFw) => newFw.existingFirmwareId === fw.id())
  );

  const updateDeviceOp = {
    op: 'update',
    data: {
      type: 'devices',
      id: currentDevice.id(),
      attributes: {
        manufacturer,
        deviceName,
        modelName,
        releaseDate: releaseDate.toISOString(),
      },
      relationships: {
        modem: {
          data: {
            type: 'modems',
            id: modemId,
          },
        },
      },
    },
  };

  const firmwareAddOps = firmwaresToAdd.map((fw) => ({
    op: 'add',
    data: {
      type: 'device-firmwares',
      attributes: {
        name: fw.firmwareName,
      },
      relationships: {
        device: {
          data: Model.getIdentifier(currentDevice),
        },
      },
    },
  }));

  const firmwareUpdateOps = firmwaresToUpdate.map((fw) => ({
    op: 'update',
    data: {
      type: 'device-firmwares',
      id: fw.existingFirmwareId,
      attributes: {
        name: fw.firmwareName,
      },
    },
  }));

  const firmwareRemoveOps = firmwaresToRemove.map((fw) => ({
    op: 'remove',
    ref: Model.getIdentifier(fw),
  }));

  return {
    'atomic:operations': [updateDeviceOp, ...firmwareRemoveOps, ...firmwareUpdateOps, ...firmwareAddOps],
  };
}

export default function EditDevicePage({ uuid }: DevicePageProps) {
  const store = useApiStore();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const apiAuthDetails = useRecoilValue(AdminAuthDetailsAtom);
  const [device, setDevice] = useState<Device | undefined>(store.getFirstBy<Device>('devices', 'uuid', uuid ?? ''));
  const [isBasicDataLoading, setIsBasicDataLoading] = useState<boolean>(!isDeviceBasicInfoLoaded(device));
  const [isFirmwareCapSetDataLoading, setIsFirmwareCapSetDataLoading] = useState<boolean>(!isDeviceFirmwareCapSetsInfoLoaded(device));
  const [error, setError] = useState<null | any>(null);

  const [formAttributeData, setFormAttributeData] = useState<FormAttributeData | undefined>();
  const [formFirmwareData, setFormFirmwareData] = useState<FormFirmwareData[] | undefined>();

  const loadFirmwareCapSetDeviceData = async () => {
    const data = await store
      .find<Device[]>('devices', {
        include: ['modem', 'deviceFirmwares', 'deviceFirmwares.capabilitySets'],
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

    const device = data?.[0];

    setIsBasicDataLoading(false);
    setIsFirmwareCapSetDataLoading(false);
    setDevice(data?.[0]);

    document.title = device?.modelName() ? `Editing ${device.modelName()}` : 'Not found';

    if (device) {
      const modem = device.modem() || null;

      setFormAttributeData({
        manufacturer: device.manufacturer(),
        deviceName: device.deviceName(),
        modelName: device.modelName(),
        modemId: modem?.id() ?? '',
        releaseDate: device.releaseDate(),
      });

      const fw = (device.deviceFirmwares() || []).filter((x) => !!x) as DeviceFirmware[];

      setFormFirmwareData(
        fw.map((f) => {
          return {
            existingFirmwareId: f.id()!,
            firmwareName: f.name()!,
          };
        })
      );
    }
  };

  useEffect(() => {
    if (isBasicDataLoading || isFirmwareCapSetDataLoading) {
      loadFirmwareCapSetDeviceData();
    }
  }, []);

  if (error) {
    return (
      <>
        <Hero color={Colors.primaryRed} firstElement>
          <h1 className="text-shout">Oops...</h1>
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
              t: 'Edit device',
              url: `/admin/devices/edit/${uuid}`,
            },
          ]}
        />

        <Section>
          <p className="text-speak" css={{ textAlign: 'center', marginTop: 16 }}>
            Something went wrong when fetching data for this device. Please try again later.
          </p>
        </Section>
      </>
    );
  }

  if (!device && isBasicDataLoading) {
    return (
      <DevicePageContext.Provider value={null}>
        <Hero color={Colors.lightGrey} firstElement>
          <h1 className="text-shout">Loading...</h1>
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
              t: 'Edit device',
              url: `/admin/devices/edit/${uuid}`,
            },
          ]}
        />

        <Section>
          <LoadingSpinner />
          <p className="text-speak" css={{ textAlign: 'center', marginTop: 16 }}>
            Just a moment...
          </p>
        </Section>
      </DevicePageContext.Provider>
    );
  }

  if (!device) {
    return (
      <DevicePageContext.Provider value={null}>
        <Hero color={Colors.primaryRed} firstElement>
          <h1 className="text-shout">Oops...</h1>
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
              t: 'Edit device',
              url: `/admin/devices/edit/${uuid}`,
            },
          ]}
        />

        <Section>
          <p className="text-speak">
            We couldn't find the device you were looking for (<code className="code">{uuid}</code>).
          </p>
          <Link href="/">Browse all devices</Link>
        </Section>
      </DevicePageContext.Provider>
    );
  }

  return (
    <DevicePageContext.Provider value={device}>
      <Hero color={Colors.primaryBlue} firstElement>
        <h1 className="text-shout">
          Editing {device.deviceName()} ({device.modelName()})
        </h1>
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
            t: `Edit ${device.deviceName()}`,
            url: `/admin/devices/edit/${uuid}`,
          },
        ]}
      />

      <AdminAuthDetailsEntry />

      <Section>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (!isValidData(formAttributeData, formFirmwareData)) {
              alert('Invalid data!');
              return;
            }

            const body = assembleAtomicRequest(device, formAttributeData!, formFirmwareData!);

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
                      enqueueSnackbar("One or more models couldn't be found. Maybe someone else modified this device while you were?", {
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

                setDevice(undefined);
                setIsBasicDataLoading(true);
                setIsFirmwareCapSetDataLoading(true);

                loadFirmwareCapSetDeviceData();
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

          <div>
            <h3 className="text-louder">Firmwares</h3>
            <p className="text-speak">You can create or overwrite capability sets for these firmwares when importing logs.</p>

            <div css={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {formFirmwareData?.length === 0 && (
                <p key="no-fw" className="text-speak-up">
                  No firmwares are stored for this device.
                </p>
              )}

              {formFirmwareData?.map((firmware, thisFwIndex) => (
                <div key={thisFwIndex} css={{ border: '2px solid black', padding: '12px 16px', display: 'flex' }}>
                  <div css={{ flexGrow: '1', paddingRight: 16 }}>
                    <TextBox
                      label="Firmware name"
                      value={firmware.firmwareName}
                      onInput={(val) => {
                        setFormFirmwareData((v) => {
                          const newFw = [...v!];
                          newFw[thisFwIndex].firmwareName = val;
                          return newFw;
                        });
                      }}
                      helpText={
                        !firmware.existingFirmwareId ? (
                          'Newly created'
                        ) : (
                          <>
                            {(store.getById<DeviceFirmware>('device-firmwares', firmware.existingFirmwareId)?.capabilitySets() || []).length} existing
                            capability set(s)
                          </>
                        )
                      }
                    />
                  </div>

                  <div
                    className="controls"
                    css={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginTop: -12,
                      marginRight: -16,
                      marginBottom: -12,
                      '& button': {
                        flexGrow: '1',
                        padding: '0 12px',
                      },
                    }}
                  >
                    <Button
                      onClick={() => {
                        if (
                          confirm(
                            'Uploaders cannot delete firmwares. If you are not an admin, your changes will be rejected, and you will need to start again.'
                          )
                        ) {
                          setFormFirmwareData((v) => v!.filter((_, i) => i !== thisFwIndex));
                        }
                      }}
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                key="add-fw"
                css={{ margin: 'auto', marginTop: 24 }}
                onClick={() => {
                  setFormFirmwareData((v) => [...v!, { firmwareName: '' }]);
                }}
              >
                Add new firmware
              </Button>
            </div>
          </div>

          <Button type="submit" css={{ alignSelf: 'center' }} disabled={!isValidData(formAttributeData, formFirmwareData)}>
            Save changes
          </Button>
        </form>
      </Section>
    </DevicePageContext.Provider>
  );
}
