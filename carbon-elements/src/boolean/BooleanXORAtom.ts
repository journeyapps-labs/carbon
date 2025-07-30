import { AtomFactory } from '@journeyapps-labs/carbon-core';
import { BooleanTransformerAtom } from './BooleanTransformerAtom';

export class BooleanXORAtomFactory extends AtomFactory<BooleanXORAtom> {
  static TYPE = 'bool-xor';

  constructor() {
    super({
      category: 'Boolean',
      label: 'XOR Gate',
      type: BooleanXORAtomFactory.TYPE
    });
  }

  generateAtom(): BooleanXORAtom {
    return new BooleanXORAtom();
  }
}

export class BooleanXORAtom extends BooleanTransformerAtom {
  constructor() {
    super({
      type: BooleanXORAtomFactory.TYPE,
      label: 'XOR',
      inputs: 2,
      transform: ([v1, v2]) => {
        return v1 !== v2;
      }
    });
  }
}
