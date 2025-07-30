import { AbstractConversionAtom, ConversionExecutorAtom } from './AbstractConversionAtom';
import { AtomFactory, CarbonPortOptions, ExecutorAtom } from '@journeyapps-labs/carbon-core';
import { NumericPort } from '../types/NumericPort';
import { ElementCategories } from '../types';
import { BooleanPort } from '../types/BooleanPort';

export class NumberToBooleanAtomFactory extends AtomFactory<NumberToBooleanAtom> {
  static TYPE = 'number-to-boolean';

  constructor() {
    super({
      type: NumberToBooleanAtomFactory.TYPE,
      label: 'Number to boolean',
      category: ElementCategories.CONVERSION
    });
  }

  generateAtom(): NumberToBooleanAtom {
    return new NumberToBooleanAtom();
  }
}

export class NumberToBooleanAtom extends AbstractConversionAtom {
  constructor() {
    super(NumberToBooleanAtomFactory.TYPE);
  }

  protected _generateExecutorAtom(): ExecutorAtom {
    return new ConversionExecutorAtom<number, boolean>(this, (value) => {
      return value > 0;
    });
  }

  generatePortIn(port: CarbonPortOptions) {
    return new NumericPort(port);
  }

  generatePortOut(port: CarbonPortOptions) {
    return new BooleanPort(port);
  }
}
