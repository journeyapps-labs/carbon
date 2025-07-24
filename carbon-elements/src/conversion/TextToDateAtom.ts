import { AbstractConversionAtom, ConversionExecutorAtom } from './AbstractConversionAtom';
import { AtomFactory, CarbonPortOptions, ExecutorAtom } from '@journeyapps-labs/carbon-core';
import { TextPort } from '../types/TextPort';
import { ElementCategories } from '../types';
import { DatePort } from '../types/DatePort';

export class TextToDateAtomFactory extends AtomFactory<TextToDateAtom> {
  static TYPE = 'text-to-date';

  constructor() {
    super({
      type: TextToDateAtomFactory.TYPE,
      label: 'Text to date',
      category: ElementCategories.CONVERSION
    });
  }

  generateAtom(): TextToDateAtom {
    return new TextToDateAtom();
  }
}

export class TextToDateAtom extends AbstractConversionAtom {
  constructor() {
    super(TextToDateAtomFactory.TYPE);
  }

  protected _generateExecutorAtom(): ExecutorAtom {
    return new ConversionExecutorAtom<string, Date>(this, (value) => {
      return new Date(value);
    });
  }

  generatePortIn(port: CarbonPortOptions) {
    return new TextPort(port);
  }

  generatePortOut(port: CarbonPortOptions) {
    return new DatePort(port);
  }
}
