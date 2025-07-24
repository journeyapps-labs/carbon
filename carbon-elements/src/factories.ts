import * as _ from 'lodash';
import { PortFactory } from '@journeyapps-labs/carbon-core';
import { BooleanInverseAtomFactory } from './boolean/BooleanInverseAtom';
import { TextJoinAtomFactory } from './text/TextJoinAtom';
import { TextUpperCaseAtomFactory } from './text/TextUpperCaseAtom';
import { NumericConstantAtomFactory } from './constants/NumericConstantAtom';
import { NumberToTextAtomFactory } from './conversion/NumberToTextAtom';
import { MathMinAtomFactory } from './math/MathMinAtom';
import { MathSumAtomFactory } from './math/MathSumAtom';
import { DateToTextAtomFactory } from './conversion/DateToTextAtom';
import { BooleanANDAtomFactory } from './boolean/BooleanANDAtom';
import { CarbonProgramAtomFactory } from './carbon/CarbonProgramAtom';
import { StringConstantAtomFactory } from './constants/StringConstantAtom';
import { BooleanORAtomFactory } from './boolean/BooleanORAtom';
import { BooleanConditionAtomFactory } from './boolean/BooleanConditionAtom';
import { TextToBooleanAtomFactory } from './conversion/TextToBooleanAtom';
import { MathSubtractAtomFactory } from './math/MathSubtractAtom';
import { CurrentDateAtomFactory } from './date/CurrentDateAtom';
import { NumericConditionAtomFactory } from './math/NumericConditionAtom';
import { MathMaxAtomFactory } from './math/MathMaxAtom';
import { MathInvAtomFactory } from './math/MathInvAtom';
import { TextSplitAtomFactory } from './text/TextSplitAtom';
import { TextToNumberAtomFactory } from './conversion/TextToNumberAtom';
import { MathAbsAtomFactory } from './math/MathAbsAtom';
import { TextLowerCaseAtomFactory } from './text/TextLowerCaseAtom';
import { TextToDateAtomFactory } from './conversion/TextToDateAtom';
import { TextTrimAtomFactory } from './text/TextTrimAtom';
import { BooleanXORAtomFactory } from './boolean/BooleanXORAtom';
import { NumberToBooleanAtomFactory } from './conversion/NumberToBooleanAtom';
import { TextConditionAtomFactory } from './text/TextConditionAtom';
import { WaitAtomFactory } from './core/WaitAtom';
import { NumericConditionEvaluatorAtomFactory } from './math/NumericConditionEvaluatorAtom';
import { DateConditionAtomFactory } from './date/DateConditionAtom';
import { DateConditionEvaluatorAtomFactory } from './date/DateConditionEvaluatorAtom';
import { MathMultiplyAtomFactory } from './math/MathMultiplyAtom';
import { MathDivAtomFactory } from './math/MathDivAtom';

export const generateFactories = _.memoize((portFactory: PortFactory) => {
  return [
    new CarbonProgramAtomFactory({
      portFactory: portFactory
    }),
    new WaitAtomFactory(),

    // constants
    new NumericConstantAtomFactory(),
    new StringConstantAtomFactory(),

    // conversion
    new NumberToTextAtomFactory(),
    new NumberToBooleanAtomFactory(),
    new TextToBooleanAtomFactory(),
    new TextToNumberAtomFactory(),
    new TextToDateAtomFactory(),
    new DateToTextAtomFactory(),

    // date
    new CurrentDateAtomFactory(),
    new DateConditionAtomFactory(),
    new DateConditionEvaluatorAtomFactory(),

    // math
    new NumericConditionAtomFactory(),
    new NumericConditionEvaluatorAtomFactory(),
    new MathAbsAtomFactory(),
    new MathInvAtomFactory(),
    new MathMinAtomFactory(),
    new MathMaxAtomFactory(),
    new MathSumAtomFactory(),
    new MathMultiplyAtomFactory(),
    new MathDivAtomFactory(),
    new MathSubtractAtomFactory(),

    // text
    new TextSplitAtomFactory(),
    new TextJoinAtomFactory(),
    new TextLowerCaseAtomFactory(),
    new TextUpperCaseAtomFactory(),
    new TextConditionAtomFactory(),
    new TextTrimAtomFactory(),

    // boolean
    new BooleanInverseAtomFactory(),
    new BooleanANDAtomFactory(),
    new BooleanORAtomFactory(),
    new BooleanXORAtomFactory(),
    new BooleanConditionAtomFactory()
  ];
});
