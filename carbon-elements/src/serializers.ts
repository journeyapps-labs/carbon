import * as _ from 'lodash';
import { JsonElementSerializer, XmlAtomSerializer } from '@journeyapps-labs/carbon-copy';

import { generateNumericConstantSerializers } from './constants/NumericConstantAtom';
import { generateNumericConditionSerializers } from './math/NumericConditionAtom';
import { generateStringConstantSerializers } from './constants/StringConstantAtom';
import { generateNumericConditionEvaluatorSerializers } from './math/NumericConditionEvaluatorAtom';
import { generateTextConditionSerializers } from './text/TextConditionAtom';
import { generateDateConditionSerializers } from './date/DateConditionAtom';

export const serializerBank: (() => { xml: XmlAtomSerializer; json: JsonElementSerializer })[] = [
  // math
  generateNumericConstantSerializers,
  generateNumericConditionSerializers,
  generateNumericConditionEvaluatorSerializers,

  // date
  generateDateConditionSerializers,
  generateNumericConditionEvaluatorSerializers,

  // text
  generateStringConstantSerializers,
  generateTextConditionSerializers
];

export const generateXMLSerializers: () => XmlAtomSerializer[] = _.memoize(() => {
  return serializerBank.map((s) => s().xml);
});

export const generateJSONSerializers: () => JsonElementSerializer[] = _.memoize(() => {
  return serializerBank.map((s) => s().json);
});
