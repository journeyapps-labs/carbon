import { AbstractTransformerAtom, AbstractTransformerAtomOptions } from '../primitives/AbstractTransformerAtom';
import { NumericPort } from '../types/NumericPort';
import { CarbonPortOptions } from '@journeyapps-labs/carbon-core';
import { ValueType } from '../types';

export class MathTransformerAtom extends AbstractTransformerAtom<number> {
  constructor(options: AbstractTransformerAtomOptions<number>) {
    super(ValueType.NUMBER, options);
  }

  generatePort(port: CarbonPortOptions) {
    return new NumericPort(port);
  }
}
