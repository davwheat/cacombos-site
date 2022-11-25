import Model from '../Model';

import type DeviceFirmware from './DeviceFirmware';
import type Modem from './Modem';

export default class Device extends Model {
  readonly type = 'devices';

  uuid = Model.attribute<string>('uuid');

  deviceName = Model.attribute<string>('deviceName');
  modelName = Model.attribute<string>('modelName');
  manufacturer = Model.attribute<string>('manufacturer');
  releaseDate = Model.attribute<Date, string>('releaseDate', Model.transformDate);

  createdAt = Model.attribute<Date, string>('createdAt', Model.transformDate);
  updatedAt = Model.attribute<Date, string>('updatedAt', Model.transformDate);

  modem = Model.hasOne<Modem>('modem');
  deviceFirmwares = Model.hasMany<DeviceFirmware>('deviceFirmwares');
}
