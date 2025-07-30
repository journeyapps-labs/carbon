import { AtomFactory } from '@journeyapps-labs/carbon-core';
import { MathTransformerAtom } from './MathTransformerAtom';
import { ElementCategories } from '../types';

export class MathDivAtomFactory extends AtomFactory<MathDivAtom> {
  static TYPE = 'math-div';

  constructor() {
    super({
      category: ElementCategories.MATH,
      label: 'Div',
      type: MathDivAtomFactory.TYPE
    });
  }

  generateAtom(): MathDivAtom {
    return new MathDivAtom();
  }
}

export class MathDivAtom extends MathTransformerAtom {
  constructor() {
    super({
      type: MathDivAtomFactory.TYPE,
      label: 'Div',
      inputs: 2,
      transform: ([v1, v2]) => {
        return v1 / v2;
      }
    });
  }
}
