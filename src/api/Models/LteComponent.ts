import modulationTransformer from '@functions/modulationTransform';
import Model from '../Model';

export default class LteComponent extends Model {
  readonly type = 'lte-components';

  band = Model.attribute<number>('band');
  dlClass = Model.attribute<string | null>('dlClass');
  ulClass = Model.attribute<string | null>('ulClass');
  mimo = Model.attribute<number | null>('mimo');
  dlModulation = Model.attribute<string | null, string | null>('dlModulation', modulationTransformer);
  ulModulation = Model.attribute<string | null, string | null>('ulModulation', modulationTransformer);
  componentIndex = Model.attribute<number>('componentIndex');

  createdAt = Model.attribute<Date, string>('createdAt', Model.transformDate);
  updatedAt = Model.attribute<Date, string>('updatedAt', Model.transformDate);
}
