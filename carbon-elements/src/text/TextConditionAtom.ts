import {
  AtomFactory,
  CarbonPortOptions,
  EnumPropertyValue,
  ExecutorAtom,
  Invocation
} from '@journeyapps-labs/carbon-core';
import { JsonElementSerializer, SimpleCarbonAtomSerializer } from '@journeyapps-labs/carbon-copy';
import { ElementCategories } from '../types';
import { AbstractConditionAtom, AbstractConditionExecutorContext } from '../primitives/AbstractConditionAtom';
import { TextPort } from '../types/TextPort';

export class TextConditionAtomFactory extends AtomFactory<TextConditionAtom> {
  static TYPE = 'text-condition';

  constructor() {
    super({
      type: TextConditionAtomFactory.TYPE,
      label: 'Text condition',
      category: ElementCategories.TEXT
    });
  }

  generateAtom(): TextConditionAtom {
    return new TextConditionAtom();
  }
}

export enum TextCondition {
  EQUALS = '=',
  NOT_EQUAL = '!=',
  STARTS_WITH = 'starts-with',
  ENDS_WITH = 'ends-with',
  CONTAINS = 'contains'
}

export class TextConditionExecutorContext extends AbstractConditionExecutorContext<string, TextConditionExecutionAtom> {
  protected compare(value: string, compareValue: string) {
    switch (this.executor.atom.condition) {
      case TextCondition.EQUALS:
        return this.evaluate(value === compareValue);
      case TextCondition.STARTS_WITH:
        return this.evaluate(value.startsWith(compareValue));
      case TextCondition.ENDS_WITH:
        return this.evaluate(value.endsWith(compareValue));
      case TextCondition.CONTAINS:
        return this.evaluate(value.indexOf(compareValue) !== -1);
      case TextCondition.NOT_EQUAL:
        return this.evaluate(value !== compareValue);
    }
  }
}

export class TextConditionExecutionAtom extends ExecutorAtom<TextConditionExecutorContext, TextConditionAtom> {
  doInvoke(invoke: Invocation) {
    super.doInvoke(invoke);
    this.addContext(invoke, new TextConditionExecutorContext()).execute();
  }
}

export class TextConditionAtom extends AbstractConditionAtom<TextCondition> {
  constructor(condition: TextCondition = TextCondition.EQUALS) {
    super(TextConditionAtomFactory.TYPE, condition);
  }

  protected _generateExecutorAtom(): ExecutorAtom {
    return new TextConditionExecutionAtom(this);
  }

  generatePort(port: CarbonPortOptions) {
    return new TextPort(port);
  }

  getConditions(): EnumPropertyValue<TextCondition>[] {
    return [
      {
        key: TextCondition.EQUALS,
        label: 'Equals'
      },
      {
        key: TextCondition.CONTAINS,
        label: 'Contains'
      },
      {
        key: TextCondition.ENDS_WITH,
        label: 'Ends with'
      },
      {
        key: TextCondition.STARTS_WITH,
        label: 'Starts with'
      },
      {
        key: TextCondition.NOT_EQUAL,
        label: 'Not equals'
      }
    ];
  }
}

export const generateTextConditionSerializers = () => {
  const json = {
    type: TextConditionAtomFactory.TYPE,
    serializeJsonElement(atom: TextConditionAtom) {
      return {
        condition: atom.condition
      };
    },
    deSerializeJsonElement(atom: TextConditionAtom, data: any): any {
      atom.condition = data.condition || TextCondition.EQUALS;
    }
  } as JsonElementSerializer<TextConditionAtom>;

  return {
    json: json,
    xml: new SimpleCarbonAtomSerializer(json)
  };
};
