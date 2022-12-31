import { useCallback, useEffect, useState } from 'react';

import Button from '@components/Inputs/Button';
import SelectDropdown from '@components/Inputs/SelectDropdown';
import { useApiStore } from '@api/ApiStoreProvider';

import RefreshIcon from 'mdi-react/RefreshIcon';

import type Modem from '@api/Models/Modem';

export interface ModemDropdownProps {
  /**
   * `''` for no selection
   */
  modemId: string;
  onSelectModem: (modemId: string) => void;
  disabled?: boolean;
}

export default function ModemDropdown({ modemId, onSelectModem, disabled = false }: ModemDropdownProps) {
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
      disabled={loadingModems || disabled}
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
