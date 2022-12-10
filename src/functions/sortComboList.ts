import { getDlComponents } from './comboDisplayHelpers';

import type Combo from '../api/Models/Combo';

export function comboListSorter(a: Combo, b: Combo): number {
  const [lteA, nrA] = getDlComponents(a);
  const [lteB, nrB] = getDlComponents(b);

  lteA.sort((a, b) => sortNumAsc(a.componentIndex(), b.componentIndex()));
  lteB.sort((a, b) => sortNumAsc(a.componentIndex(), b.componentIndex()));

  let i = 0;

  while (i < Math.min(lteA.length, lteB.length)) {
    const val = sortNumAsc(lteA[i].band(), lteB[i].band());

    if (val !== 0) {
      return val;
    }

    i++;
  }

  if (lteA.length !== lteB.length) {
    return sortNumAsc(lteA.length, lteB.length);
  }

  nrA.sort((a, b) => sortNumAsc(a.componentIndex(), b.componentIndex()));
  nrB.sort((a, b) => sortNumAsc(a.componentIndex(), b.componentIndex()));

  i = 0;

  while (i < Math.min(nrA.length, nrB.length)) {
    const val = sortNumAsc(nrA[i].band(), nrB[i].band());

    if (val !== 0) {
      return val;
    }

    i++;
  }

  if (nrA.length !== nrB.length) {
    return sortNumAsc(nrA.length, nrB.length);
  }

  return 0;
}

function sortNumAsc(a: number, b: number): number {
  return a - b;
}
