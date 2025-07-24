import { AtomBadgeAlignment, AtomImageAlignment, AtomUIBank, BuiltInThemes } from '@journeyapps-labs/carbon-ui';
import { StormUIBank } from '@journeyapps-labs/carbon-ui-storm';
import { ConstantAtomUI } from './constants/ConstantAtomUI';
import * as React from 'react';
import {
  ArrayPort,
  BooleanANDAtomFactory,
  BooleanConditionAtomFactory,
  BooleanInverseAtomFactory,
  BooleanORAtomFactory,
  BooleanXORAtomFactory,
  CarbonProgramAtomFactory,
  DateConditionAtom,
  DateConditionAtomFactory,
  DateConditionEvaluatorAtom,
  DateConditionEvaluatorAtomFactory,
  DateToTextAtomFactory,
  MathAbsAtomFactory,
  MathDivAtomFactory,
  MathInvAtomFactory,
  MathMaxAtomFactory,
  MathMinAtomFactory,
  MathMultiplyAtomFactory,
  MathSubtractAtomFactory,
  MathSumAtomFactory,
  NumberToBooleanAtomFactory,
  NumberToTextAtomFactory,
  NumericConditionAtom,
  NumericConditionAtomFactory,
  NumericConditionEvaluatorAtom,
  NumericConditionEvaluatorAtomFactory,
  NumericConstantAtomFactory,
  StringConstantAtomFactory,
  TextConditionAtom,
  TextConditionAtomFactory,
  TextLowerCaseAtomFactory,
  TextPort,
  TextToBooleanAtomFactory,
  TextToDateAtomFactory,
  TextToNumberAtomFactory,
  TextTrimAtomFactory,
  TextUpperCaseAtomFactory,
  ValueType
} from '@journeyapps-labs/carbon-elements';
import { TransformerAtomUI } from './transfomers/TransformerAtomUI';
import { ConversionAtomUI } from './conversion/ConversionAtomUI';
import { ArrayPortWidget } from './ports/ArrayPortWidget';
import { TextPortWidget } from './ports/TextPortWidget';
import { NumberPortWidget } from './ports/NumberPortWidget';
import { DatePortWidget } from './ports/DatePortWidget';
import { BooleanPortWidget } from './ports/BooleanPortWidget';
import * as _ from 'lodash';

import './fonts';

const carbon_logo = require('../media/carbon.png');
const conditional_badge = require('../media/conditional.svg');

export * from './themes';

export const registerStormUI = (bank: StormUIBank) => {
  bank.registerStormAtomUI(new ConstantAtomUI(NumericConstantAtomFactory.TYPE));
  bank.registerStormAtomUI(new ConstantAtomUI(StringConstantAtomFactory.TYPE));

  bank.registerStormAtomUI(new TransformerAtomUI(MathAbsAtomFactory.TYPE));
  bank.registerStormAtomUI(new TransformerAtomUI(MathInvAtomFactory.TYPE));
  bank.registerStormAtomUI(new TransformerAtomUI(MathMinAtomFactory.TYPE));
  bank.registerStormAtomUI(new TransformerAtomUI(MathMaxAtomFactory.TYPE));
  bank.registerStormAtomUI(new TransformerAtomUI(MathSumAtomFactory.TYPE));
  bank.registerStormAtomUI(new TransformerAtomUI(MathMultiplyAtomFactory.TYPE));
  bank.registerStormAtomUI(new TransformerAtomUI(MathDivAtomFactory.TYPE));
  bank.registerStormAtomUI(new TransformerAtomUI(MathSubtractAtomFactory.TYPE));

  bank.registerStormAtomUI(new ConversionAtomUI(NumberToTextAtomFactory.TYPE));
  bank.registerStormAtomUI(new ConversionAtomUI(NumberToBooleanAtomFactory.TYPE));
  bank.registerStormAtomUI(new ConversionAtomUI(TextToBooleanAtomFactory.TYPE));
  bank.registerStormAtomUI(new ConversionAtomUI(TextToNumberAtomFactory.TYPE));
  bank.registerStormAtomUI(new ConversionAtomUI(TextToDateAtomFactory.TYPE));
  bank.registerStormAtomUI(new ConversionAtomUI(DateToTextAtomFactory.TYPE));

  bank.registerStormAtomUI(new TransformerAtomUI(BooleanInverseAtomFactory.TYPE));
  bank.registerStormAtomUI(new TransformerAtomUI(BooleanANDAtomFactory.TYPE));
  bank.registerStormAtomUI(new TransformerAtomUI(BooleanORAtomFactory.TYPE));
  bank.registerStormAtomUI(new TransformerAtomUI(BooleanXORAtomFactory.TYPE));

  bank.registerStormAtomUI(new TransformerAtomUI(TextUpperCaseAtomFactory.TYPE));
  bank.registerStormAtomUI(new TransformerAtomUI(TextLowerCaseAtomFactory.TYPE));
  bank.registerStormAtomUI(new TransformerAtomUI(TextTrimAtomFactory.TYPE));

  bank.registerStormTypeUI({
    matches: (type) => {
      return type.startsWith(ValueType.ARRAY);
    },
    generatePortWidget: (port: ArrayPort) => {
      return <ArrayPortWidget uiBank={bank} port={port} />;
    }
  });
  bank.registerStormTypeUI({
    matches: (type) => {
      return type === ValueType.TEXT;
    },
    generatePortWidget: (port: TextPort) => {
      return <TextPortWidget connected={port.connected()} side={port.type} />;
    }
  });
  bank.registerStormTypeUI({
    matches: (type) => {
      return type === ValueType.BOOLEAN;
    },
    generatePortWidget: (port: TextPort) => {
      return <BooleanPortWidget connected={port.connected()} side={port.type} />;
    }
  });
  bank.registerStormTypeUI({
    matches: (type) => {
      return type === ValueType.NUMBER;
    },
    generatePortWidget: (port: TextPort) => {
      return <NumberPortWidget connected={port.connected()} side={port.type} />;
    }
  });
  bank.registerStormTypeUI({
    matches: (type) => {
      return type === ValueType.DATE;
    },
    generatePortWidget: (port: TextPort) => {
      return <DatePortWidget connected={port.connected()} side={port.type} />;
    }
  });
};

const lightDarkSelector = (base: BuiltInThemes) => {
  if (base === BuiltInThemes.LIGHT) {
    return '#ffffff';
  }
  return '#000000';
};

export const generateAtomUIBank = _.memoize(() => {
  const bank = new AtomUIBank();
  bank.registerUI({
    type: CarbonProgramAtomFactory.TYPE,
    color: 'mediumpurple',
    image: {
      src: carbon_logo,
      height: 40,
      alignment: AtomImageAlignment.CENTER
    }
  });

  bank.registerUI({
    type: NumericConditionAtomFactory.TYPE,
    color: lightDarkSelector,
    meta: {
      Condition: (atom: NumericConditionAtom) => {
        return atom.condition;
      }
    },
    badge: {
      src: conditional_badge,
      position: AtomBadgeAlignment.TR,
      extraPadding: 10
    }
  });

  bank.registerUI({
    type: BooleanConditionAtomFactory.TYPE,
    color: lightDarkSelector,
    badge: {
      src: conditional_badge,
      position: AtomBadgeAlignment.TR,
      extraPadding: 10
    }
  });

  bank.registerUI({
    type: DateConditionAtomFactory.TYPE,
    color: lightDarkSelector,
    meta: {
      Condition: (atom: DateConditionAtom) => {
        return atom.condition;
      },
      'Date Component': (atom: DateConditionAtom) => {
        return `${atom.datePart}`;
      }
    },
    badge: {
      src: conditional_badge,
      position: AtomBadgeAlignment.TR,
      extraPadding: 10
    }
  });
  bank.registerUI({
    type: DateConditionEvaluatorAtomFactory.TYPE,
    color: lightDarkSelector,
    meta: {
      Condition: (atom: DateConditionEvaluatorAtom) => {
        return atom.condition;
      },
      'Date Component': (atom: DateConditionEvaluatorAtom) => {
        return `${atom.datePart}`;
      }
    },
    badge: {
      src: conditional_badge,
      position: AtomBadgeAlignment.TR,
      extraPadding: 10
    }
  });
  bank.registerUI({
    type: TextConditionAtomFactory.TYPE,
    color: lightDarkSelector,
    meta: {
      Condition: (atom: TextConditionAtom) => {
        return atom.condition;
      }
    },
    badge: {
      src: conditional_badge,
      position: AtomBadgeAlignment.TR,
      extraPadding: 10
    }
  });
  bank.registerUI({
    type: NumericConditionEvaluatorAtomFactory.TYPE,
    color: lightDarkSelector,
    meta: {
      Condition: (atom: NumericConditionEvaluatorAtom) => {
        return atom.condition;
      }
    },
    badge: {
      src: conditional_badge,
      position: AtomBadgeAlignment.TR,
      extraPadding: 10
    }
  });
  return bank;
});
