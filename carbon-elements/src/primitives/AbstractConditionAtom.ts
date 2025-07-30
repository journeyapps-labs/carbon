import { AtomPortType, ExecutorAtom, ExecutorAtomContext, FlowPort } from '@journeyapps-labs/carbon-core';
import { AbstractBaseConditionAtom, AbstractBaseConditionAtomProperties } from './AbstractBaseConditionAtom';

export abstract class AbstractConditionExecutorContext<T, AE extends ExecutorAtom> extends ExecutorAtomContext<AE> {
  protected async _execute(): Promise<any> {
    let value = await this.getAttributeValue<T>(this.executor.atom.getInPort(AbstractConditionAtom.VALUE));
    let compareValue = await this.getAttributeValue<T>(
      this.executor.atom.getInPort(AbstractConditionAtom.COMPARE_VALUE)
    );
    this.compare(value, compareValue);
  }

  protected abstract compare(value: T, compare: T);

  evaluate(isTrue: boolean) {
    if (isTrue) {
      this.activateFlowPort(this.executor.atom.getOutPort(AbstractConditionAtom.PORT_TRUE));
    } else {
      this.activateFlowPort(this.executor.atom.getOutPort(AbstractConditionAtom.PORT_FALSE));
    }
  }
}

export abstract class AbstractConditionAtom<
  Condition,
  Properties extends AbstractBaseConditionAtomProperties<Condition> = AbstractBaseConditionAtomProperties<Condition>
> extends AbstractBaseConditionAtom<Condition, Properties> {
  static PORT_IN = 'in';
  static PORT_TRUE = 'TRUE';
  static PORT_FALSE = 'FALSE';

  constructor(type: string, defaultCondition: Condition) {
    super(type, defaultCondition);

    this.addPort(
      new FlowPort({
        type: AtomPortType.IN,
        key: AbstractConditionAtom.PORT_IN
      })
    );
    this.addPort(
      new FlowPort({
        type: AtomPortType.OUT,
        key: AbstractConditionAtom.PORT_TRUE
      })
    );
    this.addPort(
      new FlowPort({
        type: AtomPortType.OUT,
        key: AbstractConditionAtom.PORT_FALSE
      })
    );
  }
}
