import { useCallback, useEffect, useRef, useState } from 'react';

import DevicesListItem from './DevicesListItem';
import Button from '@components/Inputs/Button';
import LoadingSpinner from '@components/LoadingSpinner';

import { useApiStore } from '@api/ApiStoreProvider';
import Device from '@api/Models/Device';
import { JsonApiPayload } from '@api/Store';

export interface DevicesListProps {
  itemComponent: ({ device, key }: { device: Device; key: string }) => React.ReactNode;
  pageSize: number;
  sort?: string;
}

export default function DevicesList({
  pageSize,
  itemComponent = (props) => <DevicesListItem uriGenerator={(device) => `/admin/devices/edit/${device.uuid()}`} {...props} />,
  sort = '-releaseDate',
}: DevicesListProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [allDevices, setAllDevices] = useState<null | Device[]>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | any>(null);
  const abortController = useRef<AbortController | null>(null);

  const store = useApiStore();

  useEffect(() => {
    // Initial data fetch
    setIsLoading(true);

    if (abortController.current) {
      abortController.current.abort();
    }

    abortController.current = new AbortController();

    store
      .find<Device[]>('devices', { page: { limit: pageSize }, include: ['modem'], sort }, { abortController: abortController.current })
      .then((devices) => {
        if (!devices) {
          setAllDevices([]);
        } else {
          setAllDevices(devices);
        }

        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') {
          setError(null);
          return;
        }

        setError(err);
        setIsLoading(false);
      });
  }, []);

  const loadNextPage = useCallback(() => {
    setIsLoading(true);

    store
      .find<Device[]>('devices', { page: { offset: currentPage * pageSize }, include: ['modem'] })
      .then((devices) => {
        if (devices) setAllDevices((dev) => [...(dev ?? []), ...devices]);
        setIsLoading(false);
        setCurrentPage((page) => page + 1);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, [store, allDevices]);

  if (error) {
    return (
      <div>
        <p className="text-speak">Something went wrong when fetching the list of devices. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <ul
        css={{
          margin: 0,
          padding: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          // placeItems: 'center',
          gap: 16,
        }}
      >
        {allDevices?.map((device) => itemComponent({ key: device.uuid(), device }))}

        {allDevices?.length === 0 && (
          <p className="text-loud" css={{ gridColumn: '1/-1', textAlign: 'center' }}>
            There appears to be no devices.
          </p>
        )}
      </ul>

      {allDevices && ((allDevices as any)?.payload as JsonApiPayload)?.links?.next && (
        <Button
          disabled={isLoading}
          onClick={() => {
            loadNextPage();
          }}
        >
          Load more
        </Button>
      )}

      {isLoading && <LoadingSpinner css={{ marginTop: 32 }} />}
    </div>
  );
}
