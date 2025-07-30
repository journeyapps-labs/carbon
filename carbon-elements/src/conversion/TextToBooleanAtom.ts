import { AbstractConversionAtom, ConversionExecutorAtom } from './AbstractConversionAtom';
import { AtomFactory, CarbonPortOptions, ExecutorAtom } from '@journeyapps-labs/carbon-core';
import { TextPort } from '../types/TextPort';
import { ElementCategories } from '../types';
import { BooleanPort } from '../types/BooleanPort';

export class TextToBooleanAtomFactory extends AtomFactory<TextToBooleanAtom> {
  static TYPE = 'text-to-boolean';

  constructor() {
    super({
      type: TextToBooleanAtomFactory.TYPE,
      label: 'Text to boolean',
      category: ElementCategories.CONVERSION
    });
  }

  generateAtom(): TextToBooleanAtom {
    return new TextToBooleanAtom();
  }
}

export class TextToBooleanAtom extends AbstractConversionAtom {
  constructor() {
    super(TextToBooleanAtomFactory.TYPE);
  }

  protected _generateExecutorAtom(): ExecutorAtom {
    return new ConversionExecutorAtom<string, boolean>(this, (value) => {
      const v = value.trim().toLowerCase();
      return ['true', 'yes'].indexOf(v) !== -1;
    });
  }

  generatePortIn(port: CarbonPortOptions) {
    return new TextPort(port);
  }

  generatePortOut(port: CarbonPortOptions) {
    return new BooleanPort(port);
  }
}
