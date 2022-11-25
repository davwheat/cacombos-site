import Button from '@components/Inputs/Button';
import LoadingSpinner from '@components/LoadingSpinner';
import React, { useCallback, useEffect, useState } from 'react';
import { useApiStore } from '../../api/ApiStoreProvider';
import Device from '../../api/Models/Device';
import { JsonApiPayload } from '../../api/Store';
import DevicesListItem from './DevicesListItem';

const PAGE_SIZE = 20;

export default function DevicesList() {
  const [currentPage, setCurrentPage] = useState(0);
  const [allDevices, setAllDevices] = useState<null | Device[]>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | any>(null);

  const store = useApiStore();

  useEffect(() => {
    // Initial data fetch
    setIsLoading(true);

    store
      .find<Device[]>('devices', { page: { limit: PAGE_SIZE }, include: ['modem'] })
      .then((devices) => {
        if (!devices) {
          setAllDevices([]);
        } else {
          setAllDevices(devices);
        }

        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  const loadNextPage = useCallback(() => {
    setIsLoading(true);

    store
      .find<Device[]>('devices', { page: { offset: currentPage * PAGE_SIZE }, include: ['modem'] })
      .then((devices) => {
        if (devices) setAllDevices((dev) => [...(dev ?? []), ...devices]);
        setIsLoading(false);
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 16,
        }}
      >
        {allDevices?.map((device) => (
          <DevicesListItem key={device.uuid()} device={device} />
        ))}
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
