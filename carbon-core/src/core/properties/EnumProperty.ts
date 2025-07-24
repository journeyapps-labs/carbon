import { AbstractProperty, AbstractPropertyListener, AbstractPropertyOptions } from './AbstractProperty';

export interface EnumPropertyValue<E> {
  key: E;
  label: string;
  desc?: string;
}

export interface EnumPropertyOptions<E> extends AbstractPropertyOptions<E> {
  values: EnumPropertyValue<E>[];
}

export interface EnumPropertyListener extends AbstractPropertyListener {
  valuesUpdated: () => any;
}

export class EnumProperty<E> extends AbstractProperty<E, EnumPropertyOptions<E>, EnumPropertyListener> {
  static TYPE = 'enum';

  constructor(options: EnumPropertyOptions<E>) {
    super(EnumProperty.TYPE, options);
  }

  get valueLabel() {
    return this.options.values.find((v) => v.key === this.value)?.label;
  }

  setValues(values: EnumPropertyValue<E>[]) {
    this.options.values = values;
    if (!this.options.values.find((v) => v.key === this.value)) {
      this.setValue(values[0]?.key);
    }
    this.iterateListeners((cb) => cb.valuesUpdated?.());
  }
}
