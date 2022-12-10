import type Combo from '@api/Models/Combo';
import type LteComponent from '@api/Models/LteComponent';
import type NrComponent from '@api/Models/NrComponent';

export function getDlComponents(combo: Combo): [LteComponent[], NrComponent[]] {
  const lteComponents = (combo.lteComponents() as LteComponent[]).filter((c) => !!c.dlClass());
  const nrComponents = (combo.nrComponents() as NrComponent[]).filter((c) => !!c.dlClass());

  lteComponents.sort((a, b) => b.band() - a.band());
  nrComponents.sort((a, b) => b.band() - a.band());

  return [lteComponents, nrComponents];
}

export function getUlComponents(combo: Combo): [LteComponent[], NrComponent[]] {
  const lteComponents = (combo.lteComponents() as LteComponent[]).filter((c) => !!c.ulClass());
  const nrComponents = (combo.nrComponents() as NrComponent[]).filter((c) => !!c.ulClass());

  lteComponents.sort((a, b) => b.band() - a.band());
  nrComponents.sort((a, b) => b.band() - a.band());

  return [lteComponents, nrComponents];
}

export function getDlComboString(combo: Combo, format: 'complex' | 'simple'): string {
  const [lteComponents, nrComponents] = getDlComponents(combo);

  const comboFormatter: Record<'complex' | 'simple', { lte: (c: LteComponent) => string; nr: (c: NrComponent) => string }> = {
    complex: {
      lte: (c: LteComponent) => `${c.band()}${c.dlClass() ?? ''}${c.mimo() ?? ''}`,
      nr: (c: NrComponent) => `n${c.band()}${c.dlClass() ?? ''}${c.dlMimo() ?? ''}`,
    },
    simple: {
      lte: (c: LteComponent) => `${c.band()}`,
      nr: (c: NrComponent) => `n${c.band()}`,
    },
  };

  const lteIndexes = new Set<number>();
  const nrIndexes = new Set<number>();

  const lteString = lteComponents
    .filter((x) => {
      if (lteIndexes.has(x.componentIndex())) {
        return false;
      }

      lteIndexes.add(x.componentIndex());
      return true;
    })
    .map(comboFormatter[format].lte)
    .join('-');
  const nrString = nrComponents
    .filter((x) => {
      if (nrIndexes.has(x.componentIndex())) {
        return false;
      }

      nrIndexes.add(x.componentIndex());
      return true;
    })
    .map(comboFormatter[format].nr)
    .join('-');

  if (lteString && !nrString) {
    return lteString;
  }
  if (lteString && nrString) {
    return `${lteString}_${nrString}`;
  }
  if (!lteString && nrString) {
    return nrString;
  }

  return `error: combo ${combo.id()}`;
}

export function getDlMimoString(combo: Combo): React.ReactNode {
  const [lteComponents, nrComponents] = getDlComponents(combo);

  const lteIndexes = new Set<number>();
  const nrIndexes = new Set<number>();

  const lteString = lteComponents
    .filter((x) => {
      if (lteIndexes.has(x.componentIndex())) {
        return false;
      }

      lteIndexes.add(x.componentIndex());
      return true;
    })
    .map((c) => `${c.mimo()}`)
    .join('+');
  const nrString = nrComponents
    .filter((x) => {
      if (nrIndexes.has(x.componentIndex())) {
        return false;
      }

      nrIndexes.add(x.componentIndex());
      return true;
    })
    .map((c) => `${c.dlMimo()}`)
    .join('+');

  const totalStreams = getTotalStreams(combo).dl;

  const str = [lteString, nrString].filter((a) => a.length).join('+');

  return (
    <span className="text-speak">
      {str} <strong>({totalStreams})</strong>
    </span>
  );
}

export function getUlComboString(combo: Combo, format: 'complex' | 'simple'): string {
  const [lteComponents, nrComponents] = getUlComponents(combo);

  const comboFormatter: Record<'complex' | 'simple', { lte: (c: LteComponent) => string; nr: (c: NrComponent) => string }> = {
    complex: {
      lte: (c: LteComponent) => `${c.band()}${c.ulClass() ?? ''}`,
      nr: (c: NrComponent) => `n${c.band()}${c.ulClass() ?? ''}${c.ulMimo() === 1 ? '' : c.ulMimo() ?? ''}`,
    },
    simple: {
      lte: (c: LteComponent) => `${c.band()}`,
      nr: (c: NrComponent) => `n${c.band()}`,
    },
  };

  const lteIndexes = new Set<number>();
  const nrIndexes = new Set<number>();

  const lteString = lteComponents
    .filter((x) => {
      if (lteIndexes.has(x.componentIndex())) {
        return false;
      }

      lteIndexes.add(x.componentIndex());
      return true;
    })
    .map(comboFormatter[format].lte)
    .join('-');
  const nrString = nrComponents
    .filter((x) => {
      if (nrIndexes.has(x.componentIndex())) {
        return false;
      }

      nrIndexes.add(x.componentIndex());
      return true;
    })
    .map(comboFormatter[format].nr)
    .join('-');

  if (lteString && !nrString) {
    return lteString;
  }
  if (lteString && nrString) {
    return `${lteString}_${nrString}`;
  }
  if (!lteString && nrString) {
    return nrString;
  }

  return '';
}

export function getUlMimoString(combo: Combo): React.ReactNode {
  const [lteComponents, nrComponents] = getUlComponents(combo);

  const lteIndexes = new Set<number>();
  const nrIndexes = new Set<number>();

  const lteString = lteComponents
    .filter((x) => {
      if (lteIndexes.has(x.componentIndex())) {
        return false;
      }

      lteIndexes.add(x.componentIndex());
      return true;
    })
    .map((c) => '1')
    .join('+');
  const nrString = nrComponents
    .filter((x) => {
      if (nrIndexes.has(x.componentIndex())) {
        return false;
      }

      nrIndexes.add(x.componentIndex());
      return true;
    })
    .map((c) => `${c.ulMimo()}`)
    .join('+');

  const str = [lteString, nrString].filter((a) => a.length).join('+');

  const totalStreams = getTotalStreams(combo).ul;

  if (totalStreams === 0) {
    return null;
  }

  return (
    <span className="text-speak">
      {str} <strong>({totalStreams})</strong>
    </span>
  );
}

export function getTotalStreams(combo: Combo): { dl: number; ul: number } {
  const [dlLteComponents, dlNrComponents] = getDlComponents(combo);
  const [ulLteComponents, ulNrComponents] = getUlComponents(combo);

  const lteIndexes = new Set<number>();
  const nrIndexes = new Set<number>();
  const lteUlIndexes = new Set<number>();
  const nrUlIndexes = new Set<number>();

  return {
    dl:
      dlLteComponents
        .filter((x) => {
          if (lteIndexes.has(x.componentIndex())) {
            return false;
          }

          lteIndexes.add(x.componentIndex());
          return true;
        })
        .reduce((acc, c) => acc + (c.mimo() ?? 0), 0) +
      dlNrComponents
        .filter((x) => {
          if (nrIndexes.has(x.componentIndex())) {
            return false;
          }

          nrIndexes.add(x.componentIndex());
          return true;
        })
        .reduce((acc, c) => acc + (c.dlMimo() ?? 0), 0),
    ul:
      ulLteComponents
        .filter((x) => {
          if (lteUlIndexes.has(x.componentIndex())) {
            return false;
          }

          lteUlIndexes.add(x.componentIndex());
          return true;
        })
        .reduce((acc, c) => acc + 1, 0) +
      ulNrComponents
        .filter((x) => {
          if (nrUlIndexes.has(x.componentIndex())) {
            return false;
          }

          nrUlIndexes.add(x.componentIndex());
          return true;
        })
        .reduce((acc, c) => acc + (c.ulMimo() ?? 0), 0),
  };
}
