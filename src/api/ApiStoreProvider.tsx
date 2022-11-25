import React from 'react';
import Store from './Store';

const context = React.createContext<Store | null>(null);

const { Provider: ApiStoreProvider, Consumer: ApiStoreConsumer } = context;

export { ApiStoreProvider, ApiStoreConsumer };

export interface ApiStoreContextProps {
  children?: React.ReactNode;
}

export function ApiStoreContext({ children }: ApiStoreContextProps) {
  const store = new Store();

  if (typeof window !== 'undefined') {
    // @ts-expect-error
    window.store = store;
  }

  return <ApiStoreProvider value={store}>{children}</ApiStoreProvider>;
}

export function useApiStore(): Store {
  const ctx = React.useContext(context);

  if (ctx === null) {
    throw new Error('useApiStore must be used within a ApiStoreProvider');
  }

  return ctx;
}
