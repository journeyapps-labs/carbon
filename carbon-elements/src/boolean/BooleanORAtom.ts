import { AtomFactory } from '@journeyapps-labs/carbon-core';
import { BooleanTransformerAtom } from './BooleanTransformerAtom';

export class BooleanORAtomFactory extends AtomFactory<BooleanORAtom> {
  static TYPE = 'bool-or';

  constructor() {
    super({
      category: 'Boolean',
      label: 'OR Gate',
      type: BooleanORAtomFactory.TYPE
    });
  }

  generateAtom(): BooleanORAtom {
    return new BooleanORAtom();
  }
}

export class BooleanORAtom extends BooleanTransformerAtom {
  constructor() {
    super({
      type: BooleanORAtomFactory.TYPE,
      label: 'OR',
      inputs: 2,
      transform: ([v1, v2]) => {
        return !!v1 || !!v2;
      }
    });
  }
}
