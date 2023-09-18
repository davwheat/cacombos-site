import Model from '../Model';

import type CapabilitySet from './CapabilitySet';
import type LteComponent from './LteComponent';
import type NrComponent from './NrComponent';

export default class Combo extends Model {
  readonly type = 'combos';

  comboString = Model.attribute<string>('comboString');
  bandwidthCombinationSetEutra = Model.attribute<string[]>('bandwidthCombinationSetEutra');
  bandwidthCombinationSetNr = Model.attribute<string[]>('bandwidthCombinationSetNr');
  bandwidthCombinationSetIntraEndc = Model.attribute<string[]>('bandwidthCombinationSetIntraEndc');

  capabilitySet = Model.hasOne<CapabilitySet>('capabilitySet');

  lteComponents = Model.hasMany<LteComponent>('lteComponents');
  nrComponents = Model.hasMany<NrComponent>('nrComponents');

  createdAt = Model.attribute<Date, string>('createdAt', Model.transformDate);
  updatedAt = Model.attribute<Date, string>('updatedAt', Model.transformDate);
}
