import React from 'react';
import { ApiStoreContext } from '@api/ApiStoreProvider';
import { RecoilRoot } from 'recoil';
import { SnackbarProvider } from 'notistack';

import '@styles/main.less';

export function wrapRootElement({ element }) {
  return (
    <React.StrictMode>
      <RecoilRoot>
        <SnackbarProvider autoHideDuration={4000}>
          <ApiStoreContext>{element}</ApiStoreContext>
        </SnackbarProvider>
      </RecoilRoot>
    </React.StrictMode>
  );
}
