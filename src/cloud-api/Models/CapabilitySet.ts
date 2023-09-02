import Model from '../Model';

import type Combo from './Combo';
import type DeviceFirmware from './DeviceFirmware';
import type SupportedLteBand from './SupportedLteBand';
import type SupportedNrBand from './SupportedNrBand';

export default class CapabilitySet extends Model {
  readonly type = 'capability-sets';

  uuid = Model.attribute<string>('uuid');

  description = Model.attribute<string>('description');
  plmn = Model.attribute<string>('plmn');

  lteCategoryDl = Model.attribute<number>('lteCategoryDl');
  lteCategoryUl = Model.attribute<number>('lteCategoryUl');

  parserMetadata = Model.attribute<Record<string, unknown>>('parserMetadata');

  deviceFirmware = Model.hasOne<DeviceFirmware>('deviceFirmware');

  combos = Model.hasMany<Combo>('combos');
  supportedLteBands = Model.hasMany<SupportedLteBand>('supportedLteBands');
  supportedNrBands = Model.hasMany<SupportedNrBand>('supportedNrBands');

  createdAt = Model.attribute<Date, string>('createdAt', Model.transformDate);
  updatedAt = Model.attribute<Date, string>('updatedAt', Model.transformDate);
}
