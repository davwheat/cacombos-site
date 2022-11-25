import Model from '../Model';

import type LteComponent from './LteComponent';
import type NrComponent from './NrComponent';

export default class Combo extends Model {
  readonly type = 'combos';

  uuid = Model.attribute<string>('uuid');

  comboString = Model.attribute<string>('comboString');
  bandwidthCombinationSet = Model.attribute<string[]>('bandwidthCombinationSet');

  createdAt = Model.attribute<Date, string>('createdAt', Model.transformDate);
  updatedAt = Model.attribute<Date, string>('updatedAt', Model.transformDate);

  lteComponents = Model.hasMany<LteComponent>('lteComponents');
  nrComponents = Model.hasMany<NrComponent>('nrComponents');
}
