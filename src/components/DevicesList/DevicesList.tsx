import { useCallback, useEffect, useRef, useState } from 'react';

import DevicesListItem from './DevicesListItem';
import Button from '@components/Inputs/Button';
import LoadingSpinner from '@components/LoadingSpinner';
import TextBox from '@components/Inputs/TextBox';
import SelectDropdown from '@components/Inputs/SelectDropdown';

import Device from '@api/Models/Device';
import { useApiStore } from '@api/ApiStoreProvider';
import { JsonApiPayload } from '@api/Store';
import { useStateDebounced } from '@hooks/useStateDebounced';
import Colors from '@data/colors.json';

const SORT_OPTIONS = [
  { label: 'Release date (newest first)', value: '-releaseDate' },
  { label: 'Release date (oldest first)', value: 'releaseDate' },
  { label: 'Name (A to Z)', value: 'manufacturer,deviceName,modelName' },
  { label: 'Name (Z to A)', value: '-manufacturer,-deviceName,-modelName' },
];

export interface DevicesListProps {
  itemComponent: ({ device, key }: { device: Device; key: string }) => React.ReactNode;
  pageSize: number;
  sort?: string;
  allowSearch?: boolean;
  allowSort?: boolean;
}

export default function DevicesList({
  pageSize,
  itemComponent = (props) => <DevicesListItem uriGenerator={(device) => `/admin/devices/edit/${device.uuid()}`} {...props} />,
  sort: defaultSort = '-releaseDate',
  allowSearch = false,
  allowSort = false,
}: DevicesListProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [allDevices, setAllDevices] = useState<null | Device[]>(null);
  const [isLoading, setIsLoading] = useState<boolean | 'next'>(true);
  const [error, setError] = useState<null | any>(null);
  const abortController = useRef<AbortController | null>(null);
  const [searchQuery, searchQueryDebounced, setSearchQuery] = useStateDebounced<string>('', 1000);
  const [selectedSort, setSort] = useState(defaultSort ?? '-releaseDate');

  const store = useApiStore();

  useEffect(() => {
    // Initial data fetch
    setIsLoading(true);
    setCurrentPage(0);

    abortController.current?.abort();

    abortController.current = new AbortController();

    const filter = searchQuery ? { filter: { deviceFullName: searchQuery } } : {};

    store
      .find<Device[]>(
        'devices',
        { page: { offset: currentPage * pageSize, limit: pageSize }, include: ['modem'], sort: selectedSort, ...filter },
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
  }, [searchQueryDebounced, selectedSort]);

  const loadNextPage = useCallback(() => {
    setIsLoading('next');

    const oldQuery = searchQuery;

    const filter = searchQuery ? { filter: { deviceFullName: oldQuery } } : {};

    store
      .find<Device[]>('devices', {
        page: { offset: (currentPage + 1) * pageSize, limit: pageSize },
        include: ['modem'],
        sort: selectedSort,
        ...filter,
      })
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
  }, [store, allDevices, searchQueryDebounced, selectedSort]);

  if (error) {
    return (
      <div>
        <p className="text-speak">Something went wrong when fetching the list of devices. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      {(allowSearch || allowSort) && (
        <div
          css={{
            padding: 16,
            background: Colors.lightGrey,
            margin: '24px auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 16,
            maxWidth: 900,
          }}
        >
          {allowSearch && (
            <TextBox
              label="Search devices"
              placeholder="Search devices"
              value={searchQuery}
              onInput={(value) => {
                setSearchQuery(value);
              }}
            />
          )}

          {allowSort && (
            <SelectDropdown
              label="Sort by"
              options={SORT_OPTIONS}
              value={selectedSort}
              onChange={(value) => {
                setSort(value);
              }}
            />
          )}
        </div>
      )}

      {isLoading !== true && (
        <ul
          css={{
            margin: 0,
            padding: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
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
      )}

      {[false, 'next'].includes(isLoading) && allDevices && ((allDevices as any)?.payload as JsonApiPayload)?.links?.next && (
        <Button
          disabled={!!isLoading}
          onClick={() => {
            loadNextPage();
          }}
          css={{ margin: 'auto', marginTop: 16 }}
        >
          Load more
        </Button>
      )}

      {isLoading && <LoadingSpinner css={{ marginTop: 32 }} />}
    </div>
  );
}
