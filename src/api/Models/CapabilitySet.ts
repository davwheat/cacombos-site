import Model from '../Model';

import type Combo from './Combo';

export default class CapabilitySet extends Model {
  readonly type = 'capability-sets';

  uuid = Model.attribute<string>('uuid');

  description = Model.attribute<string>('description');
  plmn = Model.attribute<string>('plmn');

  createdAt = Model.attribute<Date, string>('createdAt', Model.transformDate);
  updatedAt = Model.attribute<Date, string>('updatedAt', Model.transformDate);

  combos = Model.hasMany<Combo>('combos');
}
