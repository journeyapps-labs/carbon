import { AbstractProperty, AbstractPropertyListener, AbstractPropertyOptions } from './AbstractProperty';

export type MultiBooleanValue<K extends PropertyKey> = K[];

export interface MultiBooleanPropertyOptions<K extends PropertyKey>
  extends AbstractPropertyOptions<MultiBooleanValue<K>> {
  labels: { [key in K]: string };
}

export interface MultiBooleanPropertyListener extends AbstractPropertyListener {
  labelsChanged: () => any;
}

export class MultiBooleanProperty<K extends PropertyKey = string> extends AbstractProperty<
  MultiBooleanValue<K>,
  MultiBooleanPropertyOptions<K>,
  MultiBooleanPropertyListener
> {
  static TYPE = 'multi-boolean';

  constructor(options: MultiBooleanPropertyOptions<K>) {
    super(MultiBooleanProperty.TYPE, options);
  }

  setLabels(labels: { [key in K]: string }) {
    this.options.labels = labels;
    this.iterateListeners((cb) => cb.labelsChanged?.());
  }
}
