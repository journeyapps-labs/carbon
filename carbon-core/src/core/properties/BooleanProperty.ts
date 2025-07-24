import { AbstractProperty, AbstractPropertyOptions } from './AbstractProperty';

export class BooleanProperty extends AbstractProperty<boolean, AbstractPropertyOptions<boolean>> {
  static TYPE = 'boolean';

  constructor(options: AbstractPropertyOptions<boolean>) {
    super(BooleanProperty.TYPE, options);
  }
}
