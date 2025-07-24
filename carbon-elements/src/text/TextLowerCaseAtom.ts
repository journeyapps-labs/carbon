import { AtomFactory } from '@journeyapps-labs/carbon-core';
import { TextTransformerAtom } from './TextTransformerAtom';
import { ElementCategories } from '../types';

export class TextLowerCaseAtomFactory extends AtomFactory<TextlowerCaseAtom> {
  static TYPE = 'text-lower';

  constructor() {
    super({
      category: ElementCategories.TEXT,
      label: 'Lower Case',
      type: TextLowerCaseAtomFactory.TYPE
    });
  }

  generateAtom(): TextlowerCaseAtom {
    return new TextlowerCaseAtom();
  }
}

export class TextlowerCaseAtom extends TextTransformerAtom {
  constructor() {
    super({
      type: TextLowerCaseAtomFactory.TYPE,
      label: 'Lower',
      inputs: 1,
      transform: ([v1]) => {
        return v1.toLowerCase();
      }
    });
  }
}
