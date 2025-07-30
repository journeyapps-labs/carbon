import { AbstractProperty, AbstractPropertyOptions } from './AbstractProperty';

export class MapProperty extends AbstractProperty<{ [key: string]: string }> {
  static TYPE = 'map';

  constructor(options: AbstractPropertyOptions<{ [key: string]: string }>) {
    super(MapProperty.TYPE, options);
  }
}
