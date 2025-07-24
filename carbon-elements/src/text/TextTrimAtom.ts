import { AtomFactory } from '@journeyapps-labs/carbon-core';
import { TextTransformerAtom } from './TextTransformerAtom';
import { ElementCategories } from '../types';

export class TextTrimAtomFactory extends AtomFactory<TextTrimCaseAtom> {
  static TYPE = 'text-trim';

  constructor() {
    super({
      category: ElementCategories.TEXT,
      label: 'Trim',
      type: TextTrimAtomFactory.TYPE
    });
  }

  generateAtom(): TextTrimCaseAtom {
    return new TextTrimCaseAtom();
  }
}

export class TextTrimCaseAtom extends TextTransformerAtom {
  constructor() {
    super({
      type: TextTrimAtomFactory.TYPE,
      label: 'Trim',
      inputs: 1,
      transform: ([v1]) => {
        return v1.trim();
      }
    });
  }
}
