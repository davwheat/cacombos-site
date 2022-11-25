import React from 'react';
import { ApiStoreContext } from './src/api/ApiStoreProvider';
import { RecoilRoot } from 'recoil';
import { SnackbarProvider } from 'notistack';

export function wrapRootElement({ element }) {
  return (
    <React.StrictMode>
      <RecoilRoot>
        <SnackbarProvider>
          <ApiStoreContext>{element}</ApiStoreContext>
        </SnackbarProvider>
      </RecoilRoot>
    </React.StrictMode>
  );
}
