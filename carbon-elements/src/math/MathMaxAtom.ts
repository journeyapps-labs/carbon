import { AtomFactory } from '@journeyapps-labs/carbon-core';
import { MathTransformerAtom } from './MathTransformerAtom';

export class MathMaxAtomFactory extends AtomFactory<MathMaxAtom> {
  static TYPE = 'math-max';

  constructor() {
    super({
      category: 'Math',
      label: 'Max',
      type: MathMaxAtomFactory.TYPE
    });
  }

  generateAtom(): MathMaxAtom {
    return new MathMaxAtom();
  }
}

export class MathMaxAtom extends MathTransformerAtom {
  constructor() {
    super({
      type: MathMaxAtomFactory.TYPE,
      label: 'Max',
      inputs: 2,
      transform: ([v1, v2]) => {
        return Math.max(v1, v2);
      }
    });
  }
}
