import { AtomFactory } from '@journeyapps-labs/carbon-core';
import { BooleanTransformerAtom } from './BooleanTransformerAtom';

export class BooleanANDAtomFactory extends AtomFactory<BooleanANDAtom> {
  static TYPE = 'bool-and';

  constructor() {
    super({
      category: 'Boolean',
      label: 'AND Gate',
      type: BooleanANDAtomFactory.TYPE
    });
  }

  generateAtom(): BooleanANDAtom {
    return new BooleanANDAtom();
  }
}

export class BooleanANDAtom extends BooleanTransformerAtom {
  constructor() {
    super({
      type: BooleanANDAtomFactory.TYPE,
      label: 'AND',
      inputs: 2,
      transform: ([v1, v2]) => {
        return !!v1 && !!v2;
      }
    });
  }
}
