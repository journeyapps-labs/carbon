import { AtomFactory } from '@journeyapps-labs/carbon-core';
import { MathTransformerAtom } from './MathTransformerAtom';
import { ElementCategories } from '../types';

export class MathSubtractAtomFactory extends AtomFactory<MathSubtractAtom> {
  static TYPE = 'math-sub';

  constructor() {
    super({
      category: ElementCategories.MATH,
      label: 'Subtract',
      type: MathSubtractAtomFactory.TYPE
    });
  }

  generateAtom(): MathSubtractAtom {
    return new MathSubtractAtom();
  }
}

export class MathSubtractAtom extends MathTransformerAtom {
  constructor() {
    super({
      type: MathSubtractAtomFactory.TYPE,
      label: 'Sub',
      inputs: 2,
      transform: ([v1, v2]) => {
        return v1 - v2;
      }
    });
  }
}
