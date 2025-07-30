import {
  AtomFactory,
  CarbonPortOptions,
  EnumPropertyValue,
  ExecutorAtom,
  Invocation,
  EnumProperty
} from '@journeyapps-labs/carbon-core';
import { NumericPort } from '../types/NumericPort';
import { JsonElementSerializer, SimpleCarbonAtomSerializer } from '@journeyapps-labs/carbon-copy';
import { AbstractConditionAtom, AbstractConditionExecutorContext } from '../primitives/AbstractConditionAtom';
import { ElementCategories } from '../types';
import { DateTime } from 'luxon';
import { AbstractBaseConditionAtomProperties } from '../primitives/AbstractBaseConditionAtom';
import { DatePort } from '../types/DatePort';

// !-------------- NUMERIC COMMON ------------------

export enum DateCondition {
  EQUALS = '=',
  GREATER_THAN = '>',
  LESS_THAN = '<',
  GREATER_THAN_EQUALS = '>=',
  LESS_THAN_EQUALS = '<=',
  NOT_EQUAL = '!='
}

export enum DateParts {
  DATE = 'date',
  DATE_TIME = 'datetime',
  TIME = 'time'
}

const compareTimestamp = (condition: DateCondition, value: number, compareValue: number) => {
  switch (condition) {
    case DateCondition.EQUALS:
      return value === compareValue;
    case DateCondition.GREATER_THAN:
      return value > compareValue;
    case DateCondition.GREATER_THAN_EQUALS:
      return value >= compareValue;
    case DateCondition.LESS_THAN:
      return value < compareValue;
    case DateCondition.LESS_THAN_EQUALS:
      return value <= compareValue;
    case DateCondition.NOT_EQUAL:
      return value !== compareValue;
  }
};

export const doDateCompare = (condition: DateCondition, valueDate: Date, compareDate: Date, part: DateParts) => {
  let values = [DateTime.fromJSDate(valueDate), DateTime.fromJSDate(compareDate)];
  if (part === DateParts.DATE) {
    values = values.map((o) => {
      return DateTime.fromObject({
        year: o.year,
        month: o.month,
        day: o.day
      });
    });
  } else if (part === DateParts.TIME) {
    values = values.map((o) => {
      return DateTime.fromObject({
        second: o.second,
        hour: o.hour,
        millisecond: o.millisecond,
        minute: o.minute,

        //stub
        year: 1992,
        month: 1,
        day: 1
      });
    });
  }

  const value = values[0].toUnixInteger();
  const compareValue = values[1].toUnixInteger();

  switch (condition) {
    case DateCondition.EQUALS:
      return value === compareValue;
    case DateCondition.GREATER_THAN:
      return value > compareValue;
    case DateCondition.GREATER_THAN_EQUALS:
      return value >= compareValue;
    case DateCondition.LESS_THAN:
      return value < compareValue;
    case DateCondition.LESS_THAN_EQUALS:
      return value <= compareValue;
    case DateCondition.NOT_EQUAL:
      return value !== compareValue;
  }
};

export const generateDateConditions = (): EnumPropertyValue<DateCondition>[] => {
  return [
    {
      key: DateCondition.EQUALS,
      label: 'Equals'
    },
    {
      key: DateCondition.NOT_EQUAL,
      label: 'Not Equal'
    },
    {
      key: DateCondition.GREATER_THAN,
      label: 'Greater than'
    },
    {
      key: DateCondition.GREATER_THAN_EQUALS,
      label: 'Greater than equals'
    },
    {
      key: DateCondition.LESS_THAN,
      label: 'Less than'
    },
    {
      key: DateCondition.LESS_THAN_EQUALS,
      label: 'Less than equals'
    }
  ];
};

// !--------------------------------

export class DateConditionAtomFactory extends AtomFactory<DateConditionAtom> {
  static TYPE = 'date-condition';

  constructor() {
    super({
      type: DateConditionAtomFactory.TYPE,
      label: 'Date condition',
      category: ElementCategories.DATE
    });
  }

  generateAtom(): DateConditionAtom {
    return new DateConditionAtom();
  }
}

export class DateConditionExecutorContext extends AbstractConditionExecutorContext<Date, DateConditionExecutionAtom> {
  protected compare(value: Date, compareValue: Date) {
    const evaluation = doDateCompare(this.executor.atom.condition, value, compareValue, this.executor.atom.datePart);
    return this.evaluate(evaluation);
  }
}

export class DateConditionExecutionAtom extends ExecutorAtom<DateConditionExecutorContext, DateConditionAtom> {
  doInvoke(invoke: Invocation) {
    super.doInvoke(invoke);
    this.addContext(invoke, new DateConditionExecutorContext()).execute();
  }
}

export enum DateConditionProperty {
  COMPARISION_TYPE = 'date-compare'
}

export interface DateConditionProperties extends AbstractBaseConditionAtomProperties<DateCondition> {
  [DateConditionProperty.COMPARISION_TYPE]: DateParts;
}

export const generateDatePartProperty = () => {
  return new EnumProperty<DateParts>({
    value: DateParts.DATE,
    key: DateConditionProperty.COMPARISION_TYPE,
    values: [
      {
        key: DateParts.DATE,
        label: 'Compare date component only'
      },
      {
        key: DateParts.TIME,
        label: 'Compare Time component only'
      },
      {
        key: DateParts.DATE_TIME,
        label: 'Compare Date and time only'
      }
    ],
    label: 'Date components',
    description: 'Which parts of the date are used in the comparision'
  });
};

export class DateConditionAtom extends AbstractConditionAtom<DateCondition, DateConditionProperties> {
  constructor(condition: DateCondition = DateCondition.EQUALS) {
    super(DateConditionAtomFactory.TYPE, condition);
    this.addProperty(generateDatePartProperty());
  }

  get datePart() {
    return this.getPropertyValue(DateConditionProperty.COMPARISION_TYPE);
  }

  set datePart(part: DateParts) {
    this.setPropertyValue(DateConditionProperty.COMPARISION_TYPE, part);
  }

  protected _generateExecutorAtom(): ExecutorAtom {
    return new DateConditionExecutionAtom(this);
  }

  generatePort(port: CarbonPortOptions) {
    return new DatePort(port);
  }

  getConditions(): EnumPropertyValue<DateCondition>[] {
    return generateDateConditions();
  }
}

export const generateDateConditionSerializers = () => {
  const json = {
    type: DateConditionAtomFactory.TYPE,
    serializeJsonElement(atom: DateConditionAtom) {
      return {
        condition: atom.condition,
        datePart: atom.datePart
      };
    },
    deSerializeJsonElement(atom: DateConditionAtom, data: any): any {
      atom.condition = data.condition || DateCondition.EQUALS;
      atom.datePart = data.datePart;
    }
  } as JsonElementSerializer<DateConditionAtom>;

  return {
    json: json,
    xml: new SimpleCarbonAtomSerializer(json)
  };
};
