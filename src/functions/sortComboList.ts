import { getDlComponents, getUlComponents } from './comboDisplayHelpers';

import type Combo from '@api/Models/Combo';

export function comboListSorter(a: Combo, b: Combo): number {
  const [lteA, nrA] = getDlComponents(a);
  const [lteB, nrB] = getDlComponents(b);

  lteA.sort((a, b) => sortNumAsc(a.componentIndex(), b.componentIndex()));
  lteB.sort((a, b) => sortNumAsc(a.componentIndex(), b.componentIndex()));

  nrA.sort((a, b) => sortNumAsc(a.componentIndex(), b.componentIndex()));
  nrB.sort((a, b) => sortNumAsc(a.componentIndex(), b.componentIndex()));

  const ccA = [...lteA, ...nrA];
  const ccB = [...lteB, ...nrB];

  let i = 0;

  while (i < Math.min(ccA.length, ccB.length)) {
    const thisCcA = ccA[i];
    const thisCcB = ccB[i];

    const val = sortNumAsc(thisCcA.band(), thisCcB.band());

    if (val !== 0) {
      return val;
    }

    const valClass = (thisCcA.dlClass() ?? '').localeCompare(thisCcB.dlClass() ?? '');

    if (valClass !== 0) {
      return valClass;
    }

    ++i;
  }

  const [ulLteA, ulNrA] = getUlComponents(a);
  const [ulLteB, ulNrB] = getUlComponents(b);

  ulLteA.sort((a, b) => sortNumAsc(a.componentIndex(), b.componentIndex()));
  ulLteB.sort((a, b) => sortNumAsc(a.componentIndex(), b.componentIndex()));

  ulNrA.sort((a, b) => sortNumAsc(a.componentIndex(), b.componentIndex()));
  ulNrB.sort((a, b) => sortNumAsc(a.componentIndex(), b.componentIndex()));

  const ulCcA = [...ulLteA, ...ulNrA];
  const ulCcB = [...ulLteB, ...ulNrB];

  let ulI = 0;

  while (ulI < Math.min(ulCcA.length, ulCcB.length)) {
    const thisUlCcA = ulCcA[ulI];
    const thisUlCcB = ulCcB[ulI];

    const val = sortNumAsc(thisUlCcA.band(), thisUlCcB.band());

    if (val !== 0) {
      return val;
    }

    const valClass = (thisUlCcA.ulClass() ?? '').localeCompare(thisUlCcB.ulClass() ?? '');

    if (valClass !== 0) {
      return valClass;
    }

    ++ulI;
  }

  return 0;
}

function sortNumAsc(a: number, b: number): number {
  return a - b;
}
