import { AtomFactory } from '@journeyapps-labs/carbon-core';
import { TextTransformerAtom } from './TextTransformerAtom';
import { ElementCategories } from '../types';

export class TextUpperCaseAtomFactory extends AtomFactory<TextUpperCaseAtom> {
  static TYPE = 'text-upper';

  constructor() {
    super({
      category: ElementCategories.TEXT,
      label: 'Upper Case',
      type: TextUpperCaseAtomFactory.TYPE
    });
  }

  generateAtom(): TextUpperCaseAtom {
    return new TextUpperCaseAtom();
  }
}

export class TextUpperCaseAtom extends TextTransformerAtom {
  constructor() {
    super({
      type: TextUpperCaseAtomFactory.TYPE,
      label: 'Upper',
      inputs: 1,
      transform: ([v1]) => {
        return v1.toUpperCase();
      }
    });
  }
}
