import {
  AtomFactory,
  CarbonPortOptions,
  EnumPropertyValue,
  ExecutorAtom,
  Invocation
} from '@journeyapps-labs/carbon-core';
import { NumericPort } from '../types/NumericPort';
import { JsonElementSerializer, SimpleCarbonAtomSerializer } from '@journeyapps-labs/carbon-copy';
import { AbstractConditionAtom, AbstractConditionExecutorContext } from '../primitives/AbstractConditionAtom';
import { ElementCategories } from '../types';

// !-------------- NUMERIC COMMON ------------------

export enum NumericCondition {
  EQUALS = '=',
  GREATER_THAN = '>',
  LESS_THAN = '<',
  GREATER_THAN_EQUALS = '>=',
  LESS_THAN_EQUALS = '<=',
  NOT_EQUAL = '!='
}

export const doNumericCompare = (condition: NumericCondition, value: number, compareValue: number) => {
  switch (condition) {
    case NumericCondition.EQUALS:
      return value === compareValue;
    case NumericCondition.GREATER_THAN:
      return value > compareValue;
    case NumericCondition.GREATER_THAN_EQUALS:
      return value >= compareValue;
    case NumericCondition.LESS_THAN:
      return value < compareValue;
    case NumericCondition.LESS_THAN_EQUALS:
      return value <= compareValue;
    case NumericCondition.NOT_EQUAL:
      return value !== compareValue;
  }
};

export const generateNumericConditions = (): EnumPropertyValue<NumericCondition>[] => {
  return [
    {
      key: NumericCondition.EQUALS,
      label: 'Equals'
    },
    {
      key: NumericCondition.NOT_EQUAL,
      label: 'Not Equal'
    },
    {
      key: NumericCondition.GREATER_THAN,
      label: 'Greater than'
    },
    {
      key: NumericCondition.GREATER_THAN_EQUALS,
      label: 'Greater than equals'
    },
    {
      key: NumericCondition.LESS_THAN,
      label: 'Less than'
    },
    {
      key: NumericCondition.LESS_THAN_EQUALS,
      label: 'Less than equals'
    }
  ];
};

// !--------------------------------

export class NumericConditionAtomFactory extends AtomFactory<NumericConditionAtom> {
  static TYPE = 'numeric-condition';

  constructor() {
    super({
      type: NumericConditionAtomFactory.TYPE,
      label: 'Numeric condition',
      category: ElementCategories.MATH
    });
  }

  generateAtom(): NumericConditionAtom {
    return new NumericConditionAtom();
  }
}

export class NumericConditionExecutorContext extends AbstractConditionExecutorContext<
  number,
  NumericConditionExecutionAtom
> {
  protected compare(value: number, compareValue: number) {
    const evaluation = doNumericCompare(this.executor.atom.condition, value, compareValue);
    return this.evaluate(evaluation);
  }
}

export class NumericConditionExecutionAtom extends ExecutorAtom<NumericConditionExecutorContext, NumericConditionAtom> {
  doInvoke(invoke: Invocation) {
    super.doInvoke(invoke);
    this.addContext(invoke, new NumericConditionExecutorContext()).execute();
  }
}

export class NumericConditionAtom extends AbstractConditionAtom<NumericCondition> {
  constructor(condition: NumericCondition = NumericCondition.EQUALS) {
    super(NumericConditionAtomFactory.TYPE, condition);
  }

  protected _generateExecutorAtom(): ExecutorAtom {
    return new NumericConditionExecutionAtom(this);
  }

  generatePort(port: CarbonPortOptions) {
    return new NumericPort(port);
  }

  getConditions(): EnumPropertyValue<NumericCondition>[] {
    return generateNumericConditions();
  }
}

export const generateNumericConditionSerializers = () => {
  const json = {
    type: NumericConditionAtomFactory.TYPE,
    serializeJsonElement(atom: NumericConditionAtom) {
      return {
        condition: atom.condition
      };
    },
    deSerializeJsonElement(atom: NumericConditionAtom, data: any): any {
      atom.condition = data.condition || NumericCondition.EQUALS;
    }
  } as JsonElementSerializer<NumericConditionAtom>;

  return {
    json: json,
    xml: new SimpleCarbonAtomSerializer(json)
  };
};
