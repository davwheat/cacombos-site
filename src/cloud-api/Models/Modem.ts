import Model from '../Model';

export default class Modem extends Model {
  readonly type = 'modems';

  uuid = Model.attribute<string>('uuid');

  name = Model.attribute<string>('name');

  createdAt = Model.attribute<Date, string>('createdAt', Model.transformDate);
  updatedAt = Model.attribute<Date, string>('updatedAt', Model.transformDate);
}
