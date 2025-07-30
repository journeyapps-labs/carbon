import { TypedPort } from './TypedPort';
import { ValueType } from './index';
import {
  CarbonPortOptions,
  AbstractPortType,
  AttributePort,
  AttributePortOptions
} from '@journeyapps-labs/carbon-core';

export class BooleanPort extends TypedPort {
  constructor(options: CarbonPortOptions) {
    super(ValueType.BOOLEAN, options);
  }
}

export class BooleanPortType extends AbstractPortType {
  constructor() {
    super({
      label: 'Boolean',
      type: ValueType.BOOLEAN
    });
  }

  generatePort(type: string, options: AttributePortOptions): AttributePort {
    return new BooleanPort(options);
  }
}
