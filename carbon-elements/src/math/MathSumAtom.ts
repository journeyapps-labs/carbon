import { AtomFactory } from '@journeyapps-labs/carbon-core';
import { MathTransformerAtom } from './MathTransformerAtom';
import { ElementCategories } from '../types';

export class MathSumAtomFactory extends AtomFactory<MathSumAtom> {
  static TYPE = 'math-sum';

  constructor() {
    super({
      category: ElementCategories.MATH,
      label: 'Sum',
      type: MathSumAtomFactory.TYPE
    });
  }

  generateAtom(): MathSumAtom {
    return new MathSumAtom();
  }
}

export class MathSumAtom extends MathTransformerAtom {
  constructor() {
    super({
      type: MathSumAtomFactory.TYPE,
      label: 'Sum',
      inputs: 2,
      transform: ([v1, v2]) => {
        return v1 + v2;
      }
    });
  }
}
