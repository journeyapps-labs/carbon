import { AbstractTransformerAtom, AbstractTransformerAtomOptions } from '../primitives/AbstractTransformerAtom';
import { CarbonPortOptions } from '@journeyapps-labs/carbon-core';
import { ValueType } from '../types';
import { TextPort } from '../types/TextPort';

export class TextTransformerAtom extends AbstractTransformerAtom<string> {
  constructor(options: AbstractTransformerAtomOptions<string>) {
    super(ValueType.TEXT, options);
  }

  generatePort(port: CarbonPortOptions) {
    return new TextPort(port);
  }
}
