import { AbstractTransformerAtom } from '../primitives/AbstractTransformerAtom';
import { AtomFactory } from '@journeyapps-labs/carbon-core';
import { MathTransformerAtom } from './MathTransformerAtom';

export class MathAbsAtomFactory extends AtomFactory<AbstractTransformerAtom> {
  static TYPE = 'math-abs';

  constructor() {
    super({
      category: 'Math',
      label: 'Absolute',
      type: MathAbsAtomFactory.TYPE
    });
  }

  generateAtom(): AbstractTransformerAtom {
    return new MathAbsAtom();
  }
}

export class MathAbsAtom extends MathTransformerAtom {
  constructor() {
    super({
      type: MathAbsAtomFactory.TYPE,
      label: 'Abs',
      inputs: 1,
      transform: ([v]) => {
        return Math.abs(v);
      }
    });
  }
}
