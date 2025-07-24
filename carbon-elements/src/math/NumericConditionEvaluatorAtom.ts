import { AtomFactory, CarbonPortOptions, EnumPropertyValue, ExecutorAtom } from '@journeyapps-labs/carbon-core';
import { NumericPort } from '../types/NumericPort';
import { JsonElementSerializer, SimpleCarbonAtomSerializer } from '@journeyapps-labs/carbon-copy';
import { ElementCategories } from '../types';
import { doNumericCompare, generateNumericConditions, NumericCondition } from './NumericConditionAtom';
import {
  AbstractConditionEvaluatorAtom,
  AbstractConditionEvaluatorAtomExecutor
} from '../primitives/AbstractConditionEvaluatorAtom';

export class NumericConditionEvaluatorAtomFactory extends AtomFactory<NumericConditionEvaluatorAtom> {
  static TYPE = 'numeric-evaluator';

  constructor() {
    super({
      type: NumericConditionEvaluatorAtomFactory.TYPE,
      label: 'Numeric condition evaluator',
      category: ElementCategories.MATH
    });
  }

  generateAtom(): NumericConditionEvaluatorAtom {
    return new NumericConditionEvaluatorAtom();
  }
}

export class NumericConditionEvaluatorExecutorAtom extends AbstractConditionEvaluatorAtomExecutor<number> {
  protected compare(value: number, compareValue: number) {
    return doNumericCompare(this.atom.condition, value, compareValue);
  }
}

export class NumericConditionEvaluatorAtom extends AbstractConditionEvaluatorAtom<NumericCondition> {
  constructor(condition: NumericCondition = NumericCondition.EQUALS) {
    super(NumericConditionEvaluatorAtomFactory.TYPE, condition);
  }

  protected _generateExecutorAtom(): ExecutorAtom {
    return new NumericConditionEvaluatorExecutorAtom(this);
  }

  generatePort(port: CarbonPortOptions) {
    return new NumericPort(port);
  }

  getConditions(): EnumPropertyValue<NumericCondition>[] {
    return generateNumericConditions();
  }
}

export const generateNumericConditionEvaluatorSerializers = () => {
  const json = {
    type: NumericConditionEvaluatorAtomFactory.TYPE,
    serializeJsonElement(atom: NumericConditionEvaluatorAtom) {
      return {
        condition: atom.condition
      };
    },
    deSerializeJsonElement(atom: NumericConditionEvaluatorAtom, data: any): any {
      atom.condition = data.condition || NumericCondition.EQUALS;
    }
  } as JsonElementSerializer<NumericConditionEvaluatorAtom>;

  return {
    json: json,
    xml: new SimpleCarbonAtomSerializer(json)
  };
};
