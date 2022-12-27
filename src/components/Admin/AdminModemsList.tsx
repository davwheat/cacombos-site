import { useCallback, useEffect, useState } from 'react';
import Button from '@components/Inputs/Button';
import LoadingSpinner from '@components/LoadingSpinner';
import { useApiStore } from '@api/ApiStoreProvider';
import ModemsListItem from './ModemsListItem';

import type { JsonApiPayload } from '@api/Store';
import type Modem from '@api/Models/Modem';

const PAGE_SIZE = 100;

export default function AdminModemsList() {
  const [currentPage, setCurrentPage] = useState(0);
  const [allModems, setAllModems] = useState<null | Modem[]>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | any>(null);

  const store = useApiStore();

  useEffect(() => {
    // Initial data fetch
    setIsLoading(true);

    store
      .find<Modem[]>('modems', { page: { limit: PAGE_SIZE } })
      .then((modems) => {
        if (!modems) {
          setAllModems([]);
        } else {
          setAllModems(modems);
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
      .find<Modem[]>('modems', { page: { offset: currentPage * PAGE_SIZE } })
      .then((modems) => {
        if (modems) setAllModems((modem) => [...(modem ?? []), ...modems]);
        setIsLoading(false);
        setCurrentPage((page) => page + 1);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, [store, allModems]);

  if (error) {
    return (
      <div>
        <p className="text-speak">Something went wrong when fetching the list of modems. Please try again later.</p>
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
        {allModems?.map((modem) => (
          <ModemsListItem key={modem.uuid()} modem={modem} />
        ))}
      </ul>

      {allModems && ((allModems as any)?.payload as JsonApiPayload)?.links?.next && (
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
