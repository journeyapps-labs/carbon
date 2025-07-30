import { BaseListener, BaseObserver } from '@journeyapps-labs/carbon-utils';
import { Atom } from '../basic/Atom';

export interface AbstractPropertyOptions<V> {
  key: string;
  label: string;
  description?: string;
  value: V;
}

export interface AbstractPropertyListener extends BaseListener {
  propertyChanged: () => any;
}

export class AbstractProperty<
  V = any,
  T extends AbstractPropertyOptions<V> = AbstractPropertyOptions<V>,
  L extends AbstractPropertyListener = AbstractPropertyListener
> extends BaseObserver<L> {
  value: V;
  atom: Atom;

  constructor(
    public type: string,
    public options: T
  ) {
    super();
    this.setValue(options.value);
  }

  get label() {
    return this.options.label;
  }

  get key() {
    return this.options.key;
  }

  dispose() {}

  setAtom(atom: Atom) {
    this.atom = atom;
  }

  setValue(value: V) {
    this.value = value;
    this.iterateListeners((cb) => cb.propertyChanged?.());
  }
}
