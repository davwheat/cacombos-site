import Model from '../Model';

import type Mimo from './Mimo';
import type Modulation from './Modulation';

export default class NrComponent extends Model {
  readonly type = 'nr-components';

  band = Model.attribute<number>('band');
  dlClass = Model.attribute<string | null>('dlClass');
  ulClass = Model.attribute<string | null>('ulClass');
  bandwidth = Model.attribute<number | null>('bandwidth');
  supports90mhzBw = Model.attribute<boolean | null>('supports90mhzBw');
  subcarrierSpacing = Model.attribute<number | null>('subcarrierSpacing');
  componentIndex = Model.attribute<number>('componentIndex');

  dlMimos = Model.hasMany<Mimo>('dlMimos');
  ulMimos = Model.hasMany<Mimo>('ulMimos');

  dlModulation = Model.hasMany<Modulation>('dlModulation');
  ulModulation = Model.hasMany<Modulation>('ulModulation');
}
