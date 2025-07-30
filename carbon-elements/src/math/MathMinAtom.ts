import { AtomFactory } from '@journeyapps-labs/carbon-core';
import { MathTransformerAtom } from './MathTransformerAtom';

export class MathMinAtomFactory extends AtomFactory<MathMinAtom> {
  static TYPE = 'math-min';

  constructor() {
    super({
      category: 'Math',
      label: 'Min',
      type: MathMinAtomFactory.TYPE
    });
  }

  generateAtom(): MathMinAtom {
    return new MathMinAtom();
  }
}

export class MathMinAtom extends MathTransformerAtom {
  constructor() {
    super({
      type: MathMinAtomFactory.TYPE,
      label: 'Min',
      inputs: 2,
      transform: ([v1, v2]) => {
        return Math.min(v1, v2);
      }
    });
  }
}
