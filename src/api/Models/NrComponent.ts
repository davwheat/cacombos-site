import modulationTransformer from '@functions/modulationTransform';
import Model from '../Model';

export default class NrComponent extends Model {
  readonly type = 'nr-components';

  band = Model.attribute<number>('band');
  dlClass = Model.attribute<string | null>('dlClass');
  ulClass = Model.attribute<string | null>('ulClass');
  bandwidth = Model.attribute<number | null>('bandwidth');
  subcarrierSpacing = Model.attribute<number | null>('subcarrierSpacing');
  dlMimo = Model.attribute<number | null>('dlMimo');
  ulMimo = Model.attribute<number | null>('ulMimo');
  dlModulation = Model.attribute<string | null, string | null>('dlModulation', modulationTransformer);
  ulModulation = Model.attribute<string | null, string | null>('ulModulation', modulationTransformer);

  createdAt = Model.attribute<Date, string>('createdAt', Model.transformDate);
  updatedAt = Model.attribute<Date, string>('updatedAt', Model.transformDate);
}
