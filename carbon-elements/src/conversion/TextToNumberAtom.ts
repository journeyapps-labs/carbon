import { AbstractConversionAtom, ConversionExecutorAtom } from './AbstractConversionAtom';
import { AtomFactory, CarbonPortOptions, ExecutorAtom } from '@journeyapps-labs/carbon-core';
import { TextPort } from '../types/TextPort';
import { ElementCategories } from '../types';
import { NumericPort } from '../types/NumericPort';

export class TextToNumberAtomFactory extends AtomFactory<TextToNumberAtom> {
  static TYPE = 'text-to-number';

  constructor() {
    super({
      type: TextToNumberAtomFactory.TYPE,
      label: 'Text to number',
      category: ElementCategories.CONVERSION
    });
  }

  generateAtom(): TextToNumberAtom {
    return new TextToNumberAtom();
  }
}

export class TextToNumberAtom extends AbstractConversionAtom {
  constructor() {
    super(TextToNumberAtomFactory.TYPE);
  }

  protected _generateExecutorAtom(): ExecutorAtom {
    return new ConversionExecutorAtom<string, number>(this, (value) => {
      return Number(value);
    });
  }

  generatePortIn(port: CarbonPortOptions) {
    return new TextPort(port);
  }

  generatePortOut(port: CarbonPortOptions) {
    return new NumericPort(port);
  }
}
