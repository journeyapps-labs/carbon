import { AtomFactory, CarbonPortOptions } from '@journeyapps-labs/carbon-core';
import { NumericPort } from '../types/NumericPort';
import { SimpleCarbonAtomSerializer } from '@journeyapps-labs/carbon-copy';
import { BaseConstantAtom, generateBaseConstantJsonSerializer } from './BaseConstantAtom';
import * as _ from 'lodash';
import { ElementCategories } from '../types';

export class NumericConstantAtomFactory extends AtomFactory<NumericConstantAtom> {
  static TYPE = 'numeric-constant';

  constructor() {
    super({
      type: NumericConstantAtomFactory.TYPE,
      label: 'Numeric constant',
      category: ElementCategories.MATH
    });
  }

  generateAtom(): NumericConstantAtom {
    return new NumericConstantAtom();
  }
}

export class NumericConstantAtom extends BaseConstantAtom<number> {
  constructor(value: number = 0) {
    super(NumericConstantAtomFactory.TYPE, value);
  }

  protected generatePort(options: CarbonPortOptions) {
    return new NumericPort(options);
  }

  protected decodeValue(value): number {
    if (_.isNumber(value)) {
      return value;
    }
    return Number(value);
  }
}

export const generateNumericConstantSerializers = () => {
  const json = generateBaseConstantJsonSerializer(NumericConstantAtomFactory.TYPE);
  return {
    json: json,
    xml: new SimpleCarbonAtomSerializer(json)
  };
};
