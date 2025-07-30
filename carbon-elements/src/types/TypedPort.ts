import { AttributePort, CarbonPortOptions } from '@journeyapps-labs/carbon-core';

export class TypedPort extends AttributePort {
  constructor(valueType: string, options: CarbonPortOptions) {
    super(valueType, options);
  }
}
