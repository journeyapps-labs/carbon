import { Atom } from '@journeyapps-labs/carbon-core';
import { XMLElement } from '@journeyapps/domparser';
import { XmlAtomSerializer } from './CarbonXMLSerializer';
import { JsonElementSerializer } from '../json/CarbonJsonSerializer';

export class SimpleCarbonAtomSerializer<T extends Atom> implements XmlAtomSerializer<T> {
  type: string;

  constructor(protected serializer: JsonElementSerializer) {
    this.type = serializer.type;
  }

  deSerializeXmlElement(node: XMLElement, atom: T) {
    let ob = {};
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes.item(i);
      if (attr.value !== '') {
        ob[attr.name] = attr.value;
      }
    }
    this.serializer.deSerializeJsonElement(atom, ob);
  }

  serializeXmlElement(node: XMLElement, atom: T): XMLElement {
    const payload = this.serializer.serializeJsonElement(atom);
    for (let key in payload) {
      if (payload[key] !== null) {
        node.setAttribute(key, payload[key]);
      }
    }
    return node;
  }
}
