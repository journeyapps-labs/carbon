import { BaseElement } from '@journeyapps-labs/carbon-core';
import { JsonElementSerializer } from './json/CarbonJsonSerializer';
import { SimpleCarbonAtomSerializer } from './xml/SimpleCarbonAtomSerializer';

export const generateSerializers = <T extends object = {}, A extends BaseElement = BaseElement>(
  type: string,
  serialize: (atom: A) => T,
  deserialize: (atom: A, data: T) => any
) => {
  const json = {
    type: type,
    serializeJsonElement(atom: A) {
      return serialize(atom) as T;
    },
    deSerializeJsonElement(atom: A, data: T): any {
      deserialize(atom, data);
    }
  } as JsonElementSerializer<A>;
  return {
    json: json,
    xml: new SimpleCarbonAtomSerializer(json)
  };
};
