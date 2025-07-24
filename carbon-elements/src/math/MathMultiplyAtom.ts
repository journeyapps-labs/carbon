import { AtomFactory } from '@journeyapps-labs/carbon-core';
import { MathTransformerAtom } from './MathTransformerAtom';
import { ElementCategories } from '../types';

export class MathMultiplyAtomFactory extends AtomFactory<MathMultiplyAtom> {
  static TYPE = 'math-mul';

  constructor() {
    super({
      category: ElementCategories.MATH,
      label: 'Mul',
      type: MathMultiplyAtomFactory.TYPE
    });
  }

  generateAtom(): MathMultiplyAtom {
    return new MathMultiplyAtom();
  }
}

export class MathMultiplyAtom extends MathTransformerAtom {
  constructor() {
    super({
      type: MathMultiplyAtomFactory.TYPE,
      label: 'Mul',
      inputs: 2,
      transform: ([v1, v2]) => {
        return v1 * v2;
      }
    });
  }
}
