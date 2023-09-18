import Model from '../Model';

import type Mimo from './Mimo';
import type Modulation from './Modulation';

export interface SupportedNrBandBandwidth {
  scs: number;
  bandwidthsDl: number[];
  bandwidthsUl: number[];
}

export default class SupportedNrBand extends Model {
  readonly type = 'supported-nr-bands';

  band = Model.attribute<number>('band');
  rateMatchingLteCrs = Model.attribute<boolean | null>('rateMatchingLteCrs');
  powerClass = Model.attribute<string | null>('powerClass');
  maxUplinkDutyCycle = Model.attribute<number | null>('maxUplinkDutyCycle');
  bandwidths = Model.attribute<SupportedNrBandBandwidth[] | null>('bandwidths');
  supportsEndc = Model.attribute<boolean | null>('supportsEndc');
  supportsSa = Model.attribute<boolean | null>('supportsSa');

  dlMimos = Model.hasMany<Mimo>('dlMimos');
  ulMimos = Model.hasMany<Mimo>('ulMimos');

  dlModulation = Model.hasMany<Modulation>('dlModulation');
  ulModulation = Model.hasMany<Modulation>('ulModulation');
}
