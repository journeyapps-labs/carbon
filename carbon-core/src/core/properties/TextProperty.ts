import { AbstractProperty, AbstractPropertyOptions } from './AbstractProperty';

export class TextProperty extends AbstractProperty<string, AbstractPropertyOptions<string>> {
  static TYPE = 'text';

  constructor(options: AbstractPropertyOptions<string>) {
    super(TextProperty.TYPE, options);
  }
}
