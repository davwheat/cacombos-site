import { useCallback, useEffect, useRef, useState } from 'react';

import DevicesListItem from './DevicesListItem';
import Button from '@components/Inputs/Button';
import LoadingSpinner from '@components/LoadingSpinner';
import TextBox from '@components/Inputs/TextBox';

import Device from '@api/Models/Device';
import { useApiStore } from '@api/ApiStoreProvider';
import { JsonApiPayload } from '@api/Store';
import { useStateDebounced } from '@hooks/useStateDebounced';
import Colors from '@data/colors.json';

export interface DevicesListProps {
  itemComponent: ({ device, key }: { device: Device; key: string }) => React.ReactNode;
  pageSize: number;
  sort?: string;
  allowSearch?: boolean;
}

export default function DevicesList({
  pageSize,
  itemComponent = (props) => <DevicesListItem uriGenerator={(device) => `/admin/devices/edit/${device.uuid()}`} {...props} />,
  sort = '-releaseDate',
  allowSearch = false,
}: DevicesListProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [allDevices, setAllDevices] = useState<null | Device[]>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | any>(null);
  const abortController = useRef<AbortController | null>(null);
  const [searchQuery, searchQueryDebounced, setSearchQuery] = useStateDebounced<string>('', 1000);

  const store = useApiStore();

  useEffect(() => {
    // Initial data fetch
    setIsLoading(true);
    setCurrentPage(0);

    if (abortController.current) {
      abortController.current.abort();
    }

    abortController.current = new AbortController();

    const filter = searchQuery ? { filter: { deviceFullName: searchQuery } } : {};

    store
      .find<Device[]>(
        'devices',
        { page: { offset: currentPage * pageSize, limit: pageSize }, include: ['modem'], sort, ...filter },
        { abortController: abortController.current }
      )
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
  }, [searchQueryDebounced]);

  const loadNextPage = useCallback(() => {
    setIsLoading(true);

    const oldQuery = searchQuery;

    const filter = searchQuery ? { filter: { deviceFullName: oldQuery } } : {};

    store
      .find<Device[]>('devices', { page: { offset: currentPage * pageSize, limit: pageSize }, include: ['modem'], sort, ...filter })
      .then((devices) => {
        setError(null);

        if (devices) {
          if (searchQuery === oldQuery) {
            setAllDevices((dev) => [...(dev ?? []), ...devices]);
            setCurrentPage((page) => page + 1);
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, [store, allDevices, searchQuery]);

  if (error) {
    return (
      <div>
        <p className="text-speak">Something went wrong when fetching the list of devices. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      {allowSearch && (
        <div
          css={{
            padding: 16,
            background: Colors.lightGrey,
            marginTop: 24,
            marginBottom: 24,
          }}
        >
          <TextBox
            label="Search devices"
            placeholder="Search devices"
            value={searchQuery}
            onInput={(value) => {
              setSearchQuery(value);
            }}
          />
        </div>
      )}

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
