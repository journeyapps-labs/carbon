import { AtomFactory, CarbonPortOptions } from '@journeyapps-labs/carbon-core';
import { SimpleCarbonAtomSerializer } from '@journeyapps-labs/carbon-copy';
import { BaseConstantAtom, generateBaseConstantJsonSerializer } from './BaseConstantAtom';
import { TextPort } from '../types/TextPort';
import * as _ from 'lodash';
import { ElementCategories } from '../types';

export class StringConstantAtomFactory extends AtomFactory<StringConstantAtom> {
  static TYPE = 'string-constant';

  constructor() {
    super({
      type: StringConstantAtomFactory.TYPE,
      label: 'Text constant',
      category: ElementCategories.TEXT
    });
  }

  generateAtom(): StringConstantAtom {
    return new StringConstantAtom();
  }
}

export class StringConstantAtom extends BaseConstantAtom<string> {
  constructor(value: string = '') {
    super(StringConstantAtomFactory.TYPE, value);
  }

  protected generatePort(options: CarbonPortOptions) {
    return new TextPort(options);
  }

  protected decodeValue(value): string {
    if (_.isString(value)) {
      return value;
    }
    return value ? `${value}` : '';
  }
}

export const generateStringConstantSerializers = () => {
  const json = generateBaseConstantJsonSerializer(StringConstantAtomFactory.TYPE);
  return {
    json: json,
    xml: new SimpleCarbonAtomSerializer(json)
  };
};
