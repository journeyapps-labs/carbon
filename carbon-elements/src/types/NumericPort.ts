import {
  AbstractPortType,
  AttributePort,
  AttributePortOptions,
  CarbonPortOptions
} from '@journeyapps-labs/carbon-core';
import { ValueType } from './index';
import { TypedPort } from './TypedPort';

export class NumericPort extends TypedPort {
  constructor(options: CarbonPortOptions) {
    super(ValueType.NUMBER, options);
  }
}

export class NumberPortType extends AbstractPortType {
  constructor() {
    super({
      label: 'Number',
      type: ValueType.NUMBER
    });
  }

  generatePort(type: string, options: AttributePortOptions): AttributePort {
    return new NumericPort(options);
  }
}
