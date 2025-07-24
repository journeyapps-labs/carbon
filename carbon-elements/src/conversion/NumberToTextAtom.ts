import { AbstractConversionAtom, ConversionExecutorAtom } from './AbstractConversionAtom';
import { AtomFactory, CarbonPortOptions, ExecutorAtom } from '@journeyapps-labs/carbon-core';
import { NumericPort } from '../types/NumericPort';
import { TextPort } from '../types/TextPort';
import { ElementCategories } from '../types';

export class NumberToTextAtomFactory extends AtomFactory<NumberToTextAtom> {
  static TYPE = 'number-to-text';

  constructor() {
    super({
      type: NumberToTextAtomFactory.TYPE,
      label: 'Number to text',
      category: ElementCategories.CONVERSION
    });
  }

  generateAtom(): NumberToTextAtom {
    return new NumberToTextAtom();
  }
}

export class NumberToTextAtom extends AbstractConversionAtom {
  constructor() {
    super(NumberToTextAtomFactory.TYPE);
  }

  protected _generateExecutorAtom(): ExecutorAtom {
    return new ConversionExecutorAtom<number, string>(this, (value) => {
      return `${value}`;
    });
  }

  generatePortIn(port: CarbonPortOptions) {
    return new NumericPort(port);
  }

  generatePortOut(port: CarbonPortOptions) {
    return new TextPort(port);
  }
}
