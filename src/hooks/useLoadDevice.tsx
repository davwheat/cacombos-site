import { useApiStore } from '@api/ApiStoreProvider';
import type Device from '@api/Models/Device';
import { useCallback, useEffect, useState } from 'react';

export type LoadingState = 'unloaded' | 'loading' | 'loaded' | 'error';

export interface UseLoadDeviceReturnType {
  device: Device | null;
  loadingState: LoadingState;
  error?: any;
  forceDataReload: () => void;
}

function isDeviceLoaded(device: Device | null, includes: string[]): device is Device {
  if (!device) return false;

  return includes.every((include) => {
    if (typeof (device as any)?.[include as any] !== 'function') return false;

    return !!(device as any)[include as any]();
  });
}

export function useLoadDevice(uuid: string, includes?: string[]): UseLoadDeviceReturnType {
  const store = useApiStore();
  const currentlyLoadedDevice = store.getFirstBy<Device>('devices', 'uuid', uuid);
  const isDeviceInStore = isDeviceLoaded(currentlyLoadedDevice ?? null, includes ?? []);

  const [error, setError] = useState<any | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(isDeviceInStore ? 'loaded' : 'unloaded');

  const loadData = useCallback(() => {
    setLoadingState('loading');

    store
      .find<Device[]>('devices', {
        filter: {
          uuid,
        },
        include: includes ?? [],
        page: {
          limit: 1,
        },
      })
      .then((devices) => {
        if (!devices) {
          setLoadingState('error');
          return;
        }

        setLoadingState('loaded');
      })
      .catch((e) => {
        setError(e);
        setLoadingState('error');
      });
  }, [loadingState, uuid, includes]);

  useEffect(() => {
    if (loadingState === 'unloaded') {
      loadData();
    }

    return () => {};
  }, [loadingState, loadData]);

  if (loadingState === 'loaded') {
    return {
      device: currentlyLoadedDevice ?? null,
      loadingState,
      forceDataReload: loadData,
    };
  }

  if (loadingState === 'error') {
    return {
      device: null,
      loadingState,
      error,
      forceDataReload: loadData,
    };
  }

  return {
    device: null,
    loadingState,
    forceDataReload: loadData,
  };
}
