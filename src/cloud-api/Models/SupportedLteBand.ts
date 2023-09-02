import Model from '../Model';

import type Mimo from './Mimo';
import type Modulation from './Modulation';

export default class SupportedLteBand extends Model {
  readonly type = 'supported-lte-bands';

  band = Model.attribute<number>('band');
  powerClass = Model.attribute<string | null>('powerClass');

  dlMimos = Model.hasMany<Mimo>('dlMimos');
  ulMimos = Model.hasMany<Mimo>('ulMimos');

  dlModulation = Model.hasMany<Modulation>('dlModulation');
  ulModulation = Model.hasMany<Modulation>('ulModulation');
}
