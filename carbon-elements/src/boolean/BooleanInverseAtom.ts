import { AtomFactory } from '@journeyapps-labs/carbon-core';
import { BooleanTransformerAtom } from './BooleanTransformerAtom';

export class BooleanInverseAtomFactory extends AtomFactory<BooleanInverseAtom> {
  static TYPE = 'bool-inv';

  constructor() {
    super({
      category: 'Boolean',
      label: 'Inverse',
      type: BooleanInverseAtomFactory.TYPE
    });
  }

  generateAtom(): BooleanInverseAtom {
    return new BooleanInverseAtom();
  }
}

export class BooleanInverseAtom extends BooleanTransformerAtom {
  constructor() {
    super({
      type: BooleanInverseAtomFactory.TYPE,
      label: 'Inv',
      inputs: 1,
      transform: ([v]) => {
        return !v;
      }
    });
  }
}
