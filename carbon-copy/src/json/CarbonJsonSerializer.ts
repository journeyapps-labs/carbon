import { AtomFactory, Molecule } from '@journeyapps-labs/carbon-core';
import { Atom, BaseElement } from '@journeyapps-labs/carbon-core';
import { ElementSerialized, MoleculeSerialized } from './serialize-definitions';
import { AttributePort, FlowPort } from '@journeyapps-labs/carbon-core';

export interface JsonElementSerializer<T extends BaseElement = BaseElement> {
  type: string;
  serializeJsonElement(element: T): object;
  deSerializeJsonElement(element: T, data: ReturnType<this['serializeJsonElement']>);
}

export type AtomFactorySerializer = AtomFactory & JsonElementSerializer;

export interface CarbonJsonSerializerOptions {
  factories: AtomFactory[];
  serializers?: JsonElementSerializer[];
}

export class CarbonJsonSerializer {
  factories: Map<string, AtomFactory>;
  serializers: Map<string, JsonElementSerializer>;

  constructor(protected options: CarbonJsonSerializerOptions) {
    this.factories = new Map<string, AtomFactory>();
    this.serializers = new Map<string, JsonElementSerializer>();
    options.factories.forEach((f) => {
      this.factories.set(f.type, f);
    });
    options.serializers?.forEach((f) => {
      this.serializers.set(f.type, f);
    });
  }

  deSerializeMolecule(data: MoleculeSerialized) {
    const molecule = new Molecule();
    const atomMap = new Map<string, Atom>();
    data.atoms.forEach((a) => {
      const atom = this.deSerializeElement(a);
      atomMap.set(atom.id, atom);
      molecule.addAtom(atom);
    });
    data.links.forEach((link) => {
      const port = atomMap.get(link.target.atom_id).getInPort(link.target.port_key);
      if (!port) {
        throw new Error(`broken link [${link.target.atom_id}][${link.target.port_key}]`);
      }
      if (port instanceof AttributePort || port instanceof FlowPort) {
        port.link(atomMap.get(link.source.atom_id).getOutPort(link.source.port_key));
        port.points = link.points || [];
      } else {
        throw new Error(`Unknown port type [${port.atom.id}][${port.key}]`);
      }
    });
    return molecule;
  }

  serializeMolecule(molecule: Molecule): MoleculeSerialized {
    return {
      atoms: Array.from(molecule.atoms.values()).map((a) => {
        return this.serializeElement(a);
      }),
      annotations: Array.from(molecule.annotations.values()).map((a) => {
        return this.serializeElement(a);
      }),
      links: Array.from(molecule.atoms.values()).flatMap((a) => {
        return this.serializeLinks(a);
      })
    };
  }

  serializeLinks(atom: Atom) {
    return atom.getOutPorts().flatMap((sourcePort) => {
      if (sourcePort instanceof AttributePort) {
        return Array.from(sourcePort.childrenPorts.values()).map((port) => {
          return {
            source: {
              atom_id: atom.id,
              port_key: sourcePort.key
            },
            target: {
              atom_id: port.atom.id,
              port_key: port.key
            },
            points: port.points
          };
        });
      } else if (sourcePort instanceof FlowPort) {
        if (!sourcePort.linked) {
          throw new Error(`atom ${atom.id} with out port: ${sourcePort.key} is not linked to anything`);
        }
        return [
          {
            source: {
              atom_id: atom.id,
              port_key: sourcePort.key
            },
            target: {
              port_key: sourcePort.linked.key,
              atom_id: sourcePort.linked.atom.id
            },
            points: sourcePort.linked.points
          }
        ];
      }
    });
  }

  deSerializeElement(data: ElementSerialized) {
    const atom = this.factories.get(data.type).generateElement();
    atom.x = data.x;
    atom.y = data.y;
    atom.id = data.id;
    if (this.serializers.has(data.type)) {
      this.serializers.get(data.type).deSerializeJsonElement(atom, data);
    }
    return atom;
  }

  serializeElement(atom: BaseElement): ElementSerialized {
    let serialized = {
      id: atom.id,
      x: atom.x,
      y: atom.y,
      type: atom.type
    };

    if (this.serializers.has(atom.type)) {
      serialized = {
        ...serialized,
        ...this.serializers.get(atom.type).serializeJsonElement(atom)
      };
    }
    return serialized;
  }
}
