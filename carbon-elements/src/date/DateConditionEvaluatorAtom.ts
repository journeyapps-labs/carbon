import { AtomFactory, CarbonPortOptions, EnumPropertyValue, ExecutorAtom } from '@journeyapps-labs/carbon-core';
import { DatePort } from '../types/DatePort';
import { JsonElementSerializer, SimpleCarbonAtomSerializer } from '@journeyapps-labs/carbon-copy';
import { ElementCategories } from '../types';
import {
  doDateCompare,
  generateDateConditions,
  DateCondition,
  generateDatePartProperty,
  DateConditionProperties,
  DateConditionProperty,
  DateParts
} from './DateConditionAtom';
import {
  AbstractConditionEvaluatorAtom,
  AbstractConditionEvaluatorAtomExecutor
} from '../primitives/AbstractConditionEvaluatorAtom';

export class DateConditionEvaluatorAtomFactory extends AtomFactory<DateConditionEvaluatorAtom> {
  static TYPE = 'date-evaluator';

  constructor() {
    super({
      type: DateConditionEvaluatorAtomFactory.TYPE,
      label: 'Date condition evaluator',
      category: ElementCategories.DATE
    });
  }

  generateAtom(): DateConditionEvaluatorAtom {
    return new DateConditionEvaluatorAtom();
  }
}

export class DateConditionEvaluatorExecutorAtom extends AbstractConditionEvaluatorAtomExecutor<
  Date,
  DateConditionEvaluatorAtom
> {
  protected compare(value: Date, compareValue: Date) {
    return doDateCompare(this.atom.condition, value, compareValue, this.atom.datePart);
  }
}

export class DateConditionEvaluatorAtom extends AbstractConditionEvaluatorAtom<DateCondition, DateConditionProperties> {
  constructor(condition: DateCondition = DateCondition.EQUALS) {
    super(DateConditionEvaluatorAtomFactory.TYPE, condition);
    this.addProperty(generateDatePartProperty());
  }

  get datePart() {
    return this.getPropertyValue(DateConditionProperty.COMPARISION_TYPE);
  }

  set datePart(part: DateParts) {
    this.setPropertyValue(DateConditionProperty.COMPARISION_TYPE, part);
  }

  protected _generateExecutorAtom(): ExecutorAtom {
    return new DateConditionEvaluatorExecutorAtom(this);
  }

  generatePort(port: CarbonPortOptions) {
    return new DatePort(port);
  }

  getConditions(): EnumPropertyValue<DateCondition>[] {
    return generateDateConditions();
  }
}

export const generateDateConditionEvaluatorSerializers = () => {
  const json = {
    type: DateConditionEvaluatorAtomFactory.TYPE,
    serializeJsonElement(atom: DateConditionEvaluatorAtom) {
      return {
        condition: atom.condition,
        datePart: atom.datePart
      };
    },
    deSerializeJsonElement(atom: DateConditionEvaluatorAtom, data: any): any {
      atom.condition = data.condition || DateCondition.EQUALS;
      atom.datePart = data.datePart;
    }
  } as JsonElementSerializer<DateConditionEvaluatorAtom>;

  return {
    json: json,
    xml: new SimpleCarbonAtomSerializer(json)
  };
};
