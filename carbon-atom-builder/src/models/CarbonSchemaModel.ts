import { AbstractCarbonAtomModel } from './AbstractCarbonAtomModel';
import { AtomFactory } from '@journeyapps-labs/carbon-core';
import { JsonElementSerializer, XmlAtomSerializer } from '@journeyapps-labs/carbon-copy';

export class CarbonSchemaModel {
  atoms: Set<AbstractCarbonAtomModel>;

  constructor() {
    this.atoms = new Set<AbstractCarbonAtomModel>();
  }

  addAtomModel(model: AbstractCarbonAtomModel) {
    this.atoms.add(model);
  }

  generateFactories(): AtomFactory[] {
    return Array.from(this.atoms.values()).map((a) => a.generateAtomFactory());
  }

  generateSerializers(): { xml: XmlAtomSerializer[]; json: JsonElementSerializer[] } {
    let xmlSerializers: XmlAtomSerializer[] = [];
    let jsonSerializers: JsonElementSerializer[] = [];

    Array.from(this.atoms.values()).forEach((a) => {
      const { json, xml } = a.generateSerializers();
      jsonSerializers.push(json);
      xmlSerializers.push(xml);
    });
    return {
      json: jsonSerializers,
      xml: xmlSerializers
    };
  }
}
