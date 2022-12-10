import Button from '@components/Inputs/Button';
import SelectDropdown from '@components/Inputs/SelectDropdown';
import LoadingSpinner from '@components/LoadingSpinner';
import { useCallback, useEffect, useState } from 'react';
import { useApiStore } from '@api/ApiStoreProvider';
import type Modem from '@api/Models/Modem';

import RefreshIcon from 'mdi-react/RefreshIcon';

export interface ModemDropdownProps {
  /**
   * `''` for no selection
   */
  modemId: string;
  onSelectModem: (modemId: string) => void;
}

export default function ModemDropdown({ modemId, onSelectModem }: ModemDropdownProps) {
  const [loadingModems, setLoadingModems] = useState(true);
  const [modems, setModems] = useState<Modem[]>([]);
  const store = useApiStore();

  const loadAllModems = useCallback(() => {
    // Modems aren't paginated, so we can just load them all at once.
    store.find<Modem[]>('modems').then((m) => {
      setModems(m!);
      setLoadingModems(false);
    });
  }, [store]);

  useEffect(() => {
    loadAllModems();
  }, []);

  const options = loadingModems ? [] : [{ value: '', label: 'No selection' }, ...modems.map((m) => ({ value: m.id()!, label: m.name() }))];

  return (
    <SelectDropdown
      label="Choose modem"
      value={modemId}
      options={options}
      disabled={loadingModems}
      onChange={(val) => {
        onSelectModem(val);
      }}
      endAdornment={
        <Button
          css={{
            height: 40,
            padding: '0 8px',
          }}
          onClick={() => {
            setLoadingModems(true);
            loadAllModems();
          }}
        >
          <RefreshIcon />
        </Button>
      }
      helpText="If you need a new modem, create that first, then hit refresh here to show it in the list."
    />
  );
}
