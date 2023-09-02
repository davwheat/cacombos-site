import modulationTransformer from '@functions/modulationTransform';
import Model from '../Model';

export default class Modulation extends Model {
  readonly type = 'modulations';

  modulation = Model.attribute<string, string>('modulation', modulationTransformer);
  isUl = Model.attribute<boolean>('isUl');
}
