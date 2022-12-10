import Model from '../Model';

import type CapabilitySet from './CapabilitySet';

export default class DeviceFirmware extends Model {
  readonly type = 'device-firmwares';

  uuid = Model.attribute<string>('uuid');

  name = Model.attribute<string>('name');

  createdAt = Model.attribute<Date, string>('createdAt', Model.transformDate);
  updatedAt = Model.attribute<Date, string>('updatedAt', Model.transformDate);

  capabilitySets = Model.hasMany<CapabilitySet>('capabilitySets');
}
