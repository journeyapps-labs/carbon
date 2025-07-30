import {
  AtomPortType,
  AttributePort,
  ExecutorAtom,
  ExecutorAtomContext,
  Invocation
} from '@journeyapps-labs/carbon-core';
import { BooleanPort } from '../types/BooleanPort';
import { AbstractBaseConditionAtom, AbstractBaseConditionAtomProperties } from './AbstractBaseConditionAtom';

export abstract class AbstractConditionEvaluatorAtomExecutor<
  T,
  P extends AbstractConditionEvaluatorAtom<any> = AbstractConditionEvaluatorAtom<any>
> extends ExecutorAtom<ExecutorAtomContext, P> {
  async getAttributeValueFor(port: AttributePort, invocation: Invocation): Promise<any> {
    const valuePort = this.atom.getInPort(AbstractBaseConditionAtom.VALUE);
    const comparePort = this.atom.getInPort(AbstractBaseConditionAtom.COMPARE_VALUE);

    const value = await this.program.executors
      .get(valuePort.linked.atom)
      .getAttributeValueFor(valuePort.linked, invocation);
    const compare = await this.program.executors
      .get(comparePort.linked.atom)
      .getAttributeValueFor(comparePort.linked, invocation);

    return this.compare(value, compare);
  }

  protected abstract compare(value: T, compare: T): boolean;
}

export abstract class AbstractConditionEvaluatorAtom<
  Condition,
  Properties extends AbstractBaseConditionAtomProperties<Condition> = AbstractBaseConditionAtomProperties<Condition>
> extends AbstractBaseConditionAtom<Condition, Properties> {
  static PORT_RESULT = 'result';

  constructor(type: string, defaultCondition: Condition) {
    super(type, defaultCondition);
    this.addPort(
      new BooleanPort({
        type: AtomPortType.OUT,
        key: AbstractConditionEvaluatorAtom.PORT_RESULT
      })
    );
  }
}
