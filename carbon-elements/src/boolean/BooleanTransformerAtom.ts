import { AbstractTransformerAtom, AbstractTransformerAtomOptions } from '../primitives/AbstractTransformerAtom';
import { CarbonPortOptions } from '@journeyapps-labs/carbon-core';
import { ValueType } from '../types';
import { BooleanPort } from '../types/BooleanPort';

export class BooleanTransformerAtom extends AbstractTransformerAtom<boolean> {
  constructor(options: AbstractTransformerAtomOptions<boolean>) {
    super(ValueType.BOOLEAN, options);
  }

  generatePort(port: CarbonPortOptions) {
    return new BooleanPort(port);
  }
}
