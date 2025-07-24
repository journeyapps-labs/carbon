import { AttributePort } from '@journeyapps-labs/carbon-core';
import { TypedPort } from './TypedPort';

export class ArrayPort extends AttributePort {
  constructor(public port: TypedPort) {
    super(`array:${port.valueType}`, {
      key: port.key,
      type: port.type,
      label: port.label
    });
  }
}
