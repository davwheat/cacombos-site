import type Combo from '@api/Models/Combo';
import LteComponent from '@api/Models/LteComponent';
import NrComponent from '@api/Models/NrComponent';

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

function getDlCcClass(component: NrComponent | LteComponent, ignoreA: boolean = false): string {
  let ccClass = component.dlClass();

  if (!ccClass || (ignoreA && ccClass === 'A')) return '';

  return ccClass;
}

function getUlCcClass(component: NrComponent | LteComponent, ignoreA: boolean = false): string {
  let ccClass = component.ulClass();

  if (!ccClass || (ignoreA && ccClass === 'A')) return '';

  return ccClass;
}

export function getDlComboString(combo: Combo, format: 'complex' | 'simple'): string {
  const [lteComponents, nrComponents] = getDlComponents(combo);

  const comboFormatter: Record<'complex' | 'simple', { lte: (c: LteComponent) => string; nr: (c: NrComponent) => string }> = {
    complex: {
      lte: (c: LteComponent) => `${c.band()}${getDlCcClass(c) || '?'}${c.mimo() ?? ''}`,
      nr: (c: NrComponent) => `n${c.band()}${getDlCcClass(c) || '?'}${c.dlMimo() ?? ''}`,
    },
    simple: {
      lte: (c: LteComponent) => `${c.band()}${getDlCcClass(c, true)}`,
      nr: (c: NrComponent) => `n${c.band()}${getDlCcClass(c, true)}`,
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
  const allStreams = getAllStreams(combo).dl;
  const totalStreams = allStreams.reduce((sum, s) => sum + s, 0);

  return (
    <span className="text-speak">
      {allStreams.join('+')} <strong>({totalStreams})</strong>
    </span>
  );
}

export function getUlComboString(combo: Combo, format: 'complex' | 'simple'): string {
  const [lteComponents, nrComponents] = getUlComponents(combo);

  const comboFormatter: Record<'complex' | 'simple', { lte: (c: LteComponent) => string; nr: (c: NrComponent) => string }> = {
    complex: {
      lte: (c: LteComponent) => `${c.band()}${getUlCcClass(c)}`,
      nr: (c: NrComponent) => `n${c.band()}${getUlCcClass(c)}${c.ulMimo() === 1 ? '' : c.ulMimo() ?? ''}`,
    },
    simple: {
      lte: (c: LteComponent) => `${c.band()}${getUlCcClass(c, true)}`,
      nr: (c: NrComponent) => `n${c.band()}${getUlCcClass(c, true)}`,
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
  const allStreams = getAllStreams(combo).ul;
  const totalStreams = allStreams.reduce((sum, s) => sum + s, 0);

  if (totalStreams === 0) {
    return null;
  }

  return (
    <span className="text-speak">
      {allStreams.join('+')} <strong>({totalStreams})</strong>
    </span>
  );
}

/**
 * @see https://www.sqimway.com/lte_ca_band.php#lte_ca_class
 */
const lteClassToMultiplier: Record<string, number> = {
  A: 1,
  B: 2,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  I: 8,
};

/**
 * @see https://www.sqimway.com/nr_ca.php
 */
const nrFr1ClassToMultiplier: Record<string, number> = {
  A: 1,
  B: 2,
  C: 2,
  D: 3,
  E: 4,
  G: 3,
  H: 4,
  I: 5,
  J: 6,
  K: 7,
  L: 8,
  M: 3,
  N: 4,
  O: 5,
};

/**
 * @see https://www.sqimway.com/nr_ca.php
 */
const nrFr2ClassToMultiplier: Record<string, number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 2,
  E: 3,
  F: 4,
  G: 2,
  H: 3,
  I: 4,
  J: 5,
  K: 6,
  L: 7,
  M: 8,
  O: 2,
  P: 3,
  Q: 4,
};

export function getDlStreamCountForComponent(component: LteComponent | NrComponent): number[] {
  if (component instanceof LteComponent) {
    const ccClass = component.dlClass() ?? 'A';

    return new Array(lteClassToMultiplier[ccClass]).fill(component.mimo() ?? 0);
  }

  if (component instanceof NrComponent) {
    const ccClass = component.dlClass() ?? 'A';

    const fr2 = component.band() > 256;
    const classMapping = fr2 ? nrFr2ClassToMultiplier : nrFr1ClassToMultiplier;

    return new Array(classMapping[ccClass]).fill(component.dlMimo() ?? 0);
  }

  return [0];
}

export function getUlStreamCountForComponent(component: LteComponent | NrComponent): number[] {
  if (component instanceof LteComponent) {
    const ccClass = component.ulClass() ?? 'A';

    return new Array(lteClassToMultiplier[ccClass]).fill(1);
  }

  if (component instanceof NrComponent) {
    const ccClass = component.ulClass() ?? 'A';

    const fr2 = component.band() > 256;
    const classMapping = fr2 ? nrFr2ClassToMultiplier : nrFr1ClassToMultiplier;

    return new Array(classMapping[ccClass]).fill(component.ulMimo() ?? 0);
  }

  return [0];
}

export function getTotalStreams(combo: Combo): { dl: number; ul: number } {
  const streams = getAllStreams(combo);

  return {
    dl: streams.dl.reduce((acc, x) => acc + x, 0),
    ul: streams.ul.reduce((acc, x) => acc + x, 0),
  };
}

export function getAllStreams(combo: Combo): { dl: number[]; ul: number[] } {
  const [dlLteComponents, dlNrComponents] = getDlComponents(combo);
  const [ulLteComponents, ulNrComponents] = getUlComponents(combo);

  const lteIndexes = new Set<number>();
  const nrIndexes = new Set<number>();
  const lteUlIndexes = new Set<number>();
  const nrUlIndexes = new Set<number>();

  const suitableDlLteComponents = dlLteComponents.filter((x) => {
    if (lteIndexes.has(x.componentIndex())) {
      return false;
    }

    lteIndexes.add(x.componentIndex());
    return true;
  });

  const suitableDlNrComponents = dlNrComponents.filter((x) => {
    if (nrIndexes.has(x.componentIndex())) {
      return false;
    }

    nrIndexes.add(x.componentIndex());
    return true;
  });

  const suitableUlLteComponents = ulLteComponents.filter((x) => {
    if (lteUlIndexes.has(x.componentIndex())) {
      return false;
    }

    lteUlIndexes.add(x.componentIndex());
    return true;
  });

  const suitableUlNrComponents = ulNrComponents.filter((x) => {
    if (nrUlIndexes.has(x.componentIndex())) {
      return false;
    }

    nrUlIndexes.add(x.componentIndex());
    return true;
  });

  return {
    dl: [
      ...suitableDlLteComponents.map((c) => getDlStreamCountForComponent(c)).flat(),
      ...suitableDlNrComponents.map((c) => getDlStreamCountForComponent(c)).flat(),
    ],
    ul: [
      ...suitableUlLteComponents.map((c) => getUlStreamCountForComponent(c)).flat(),
      ...suitableUlNrComponents.map((c) => getUlStreamCountForComponent(c)).flat(),
    ],
  };
}
