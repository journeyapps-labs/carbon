import { TypedPort } from './TypedPort';
import { ValueType } from './index';
import {
  AbstractPortType,
  AttributePort,
  AttributePortOptions,
  CarbonPortOptions
} from '@journeyapps-labs/carbon-core';

export class DatePort extends TypedPort {
  constructor(options: CarbonPortOptions) {
    super(ValueType.DATE, options);
  }
}

export class DatePortType extends AbstractPortType {
  constructor() {
    super({
      label: 'Date',
      type: ValueType.DATE
    });
  }

  generatePort(type: string, options: AttributePortOptions): AttributePort {
    return new DatePort(options);
  }
}
