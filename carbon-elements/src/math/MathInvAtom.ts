import { AbstractTransformerAtom } from '../primitives/AbstractTransformerAtom';
import { AtomFactory } from '@journeyapps-labs/carbon-core';
import { MathTransformerAtom } from './MathTransformerAtom';

export class MathInvAtomFactory extends AtomFactory<AbstractTransformerAtom> {
  static TYPE = 'math-inv';

  constructor() {
    super({
      category: 'Math',
      label: 'Inverse',
      type: MathInvAtomFactory.TYPE
    });
  }

  generateAtom(): AbstractTransformerAtom {
    return new MathInvAtom();
  }
}

export class MathInvAtom extends MathTransformerAtom {
  constructor() {
    super({
      type: MathInvAtomFactory.TYPE,
      label: 'Inv',
      inputs: 1,
      transform: ([v]) => {
        return 1 / v;
      }
    });
  }
}
