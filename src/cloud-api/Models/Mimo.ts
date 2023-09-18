import Model from '../Model';

export default class Mimo extends Model {
  readonly type = 'mimos';

  mimo = Model.attribute<number>('mimo');
  isUl = Model.attribute<boolean>('isUl');
}
