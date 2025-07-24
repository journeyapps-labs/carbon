import { TypedPort } from './TypedPort';
import { ValueType } from './index';
import {
  AbstractPortType,
  AttributePort,
  AttributePortOptions,
  CarbonPortOptions
} from '@journeyapps-labs/carbon-core';

export class TextPort extends TypedPort {
  constructor(options: CarbonPortOptions) {
    super(ValueType.TEXT, options);
  }
}

export class TextPortType extends AbstractPortType {
  constructor() {
    super({
      label: 'Text',
      type: ValueType.TEXT
    });
  }

  generatePort(type: string, options: AttributePortOptions): AttributePort {
    return new TextPort(options);
  }
}
