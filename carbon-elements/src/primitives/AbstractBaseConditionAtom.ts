import { Atom, AtomPortType, CarbonPortOptions, EnumProperty, EnumPropertyValue } from '@journeyapps-labs/carbon-core';

export interface AbstractBaseConditionAtomProperties<T> {
  condition: T;
}

export abstract class AbstractBaseConditionAtom<
  Condition,
  Properties extends AbstractBaseConditionAtomProperties<Condition> = AbstractBaseConditionAtomProperties<Condition>
> extends Atom<Properties> {
  static VALUE = 'value';
  static COMPARE_VALUE = 'compare';

  constructor(type: string, defaultCondition: Condition) {
    super(type);
    this.addProperty(
      new EnumProperty<Condition>({
        key: 'condition',
        values: this.getConditions(),
        value: defaultCondition,
        label: 'Condition'
      })
    );
    this.addPort(
      this.generatePort({
        type: AtomPortType.IN,
        key: AbstractBaseConditionAtom.VALUE
      })
    );
    this.addPort(
      this.generatePort({
        type: AtomPortType.IN,
        key: AbstractBaseConditionAtom.COMPARE_VALUE
      })
    );
  }

  set condition(condition: Condition) {
    this.setPropertyValue('condition', condition);
  }

  get condition() {
    return this.getPropertyValue('condition');
  }

  abstract getConditions(): EnumPropertyValue<Condition>[];

  abstract generatePort(port: CarbonPortOptions);
}
