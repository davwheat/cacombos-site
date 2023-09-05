import Model from '../Model';

import type Mimo from './Mimo';
import type Modulation from './Modulation';

export default class LteComponent extends Model {
  readonly type = 'lte-components';

  band = Model.attribute<number>('band');
  dlClass = Model.attribute<string | null>('dlClass');
  ulClass = Model.attribute<string | null>('ulClass');
  componentIndex = Model.attribute<number>('componentIndex');

  dlMimos = Model.hasMany<Mimo>('dlMimos');
  ulMimos = Model.hasMany<Mimo>('ulMimos');

  dlModulation = Model.hasMany<Modulation>('dlModulation');
  ulModulation = Model.hasMany<Modulation>('ulModulation');

  /**
   * Returns the maximum DL MIMO value for this component.
   *
   * If the mimo relation isn't loaded, or there are no mimos, returns `0`.
   */
  maxDlMimo(): number {
    return this.maxMimo(this.dlMimos());
  }

  /**
   * Returns the maximum DL MIMO value for this component.
   *
   * If the mimo relation isn't loaded, or there are no mimos, returns `0`.
   */
  maxUlMimo(): number {
    return this.maxMimo(this.ulMimos());
  }

  dlMimoString(allowMultiple: boolean = true): string {
    return this.mimosToMimoString(this.dlMimos(), allowMultiple);
  }

  ulMimoString(allowMultiple: boolean = true): string {
    return this.mimosToMimoString(this.ulMimos(), allowMultiple);
  }

  private mimosToMimoString(mimos: (Mimo | undefined)[] | false | null, allowMultiple: boolean): string {
    if (!mimos || mimos.length === 0) return '';

    if (!allowMultiple) return mimos[0]?.mimo().toString() || '';

    return mimos.map((mimo) => mimo?.mimo()).join('/');
  }

  private maxMimo(mimos: (Mimo | undefined)[] | false | null): number {
    if (!mimos || mimos.length === 0) return 0;

    return mimos.reduce((max, mimo) => {
      if (!mimo) return max;

      return Math.max(max, mimo.mimo());
    }, 0);
  }
}
