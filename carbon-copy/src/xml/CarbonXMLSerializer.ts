import {
  Atom,
  AtomFactory,
  AttributePort,
  BaseElement,
  FlowPort,
  Molecule,
  AnnotationElement
} from '@journeyapps-labs/carbon-core';
import { createDocument, parse } from '@journeyapps/core-xml';
import { XMLDocument, XMLElement } from '@journeyapps/domparser';
import { CarbonParseError } from '../CarbonParseError';
import { CarbonXMLParseError } from './CarbonXMLParseError';
import { prettyText } from '@journeyapps/core-xml';

export interface XmlElementSerializer<T extends BaseElement = BaseElement> {
  type: string;

  serializeXmlElement(node: XMLElement, element: T, document: XMLDocument): XMLElement;

  deSerializeXmlElement(node: XMLElement, element: T);
}

export type XmlAtomSerializer<T extends Atom = Atom> = XmlElementSerializer<T>;

export enum NodeType {
  ANNOTATION = 'annotation',
  ATOM = 'atom'
}

export class CarbonXMLSerializerOptions {
  factories: AtomFactory[];
  serializers?: XmlElementSerializer[];
}

export class CarbonXMLSerializer {
  factories: Map<string, AtomFactory>;
  serializers: Map<string, XmlElementSerializer>;

  constructor(protected options: CarbonXMLSerializerOptions) {
    this.factories = new Map<string, AtomFactory>();
    this.serializers = new Map<string, XmlElementSerializer>();
    options.factories.forEach((f) => {
      this.factories.set(f.type, f);
    });
    options.serializers?.forEach((f) => {
      this.serializers.set(f.type, f);
    });
  }

  static getAttribute(element: XMLElement, attr: string) {
    if (!element.hasAttribute(attr)) {
      throw new CarbonXMLParseError(element, `missing attribute ${attr}`);
    }
    return element.getAttribute(attr);
  }

  static parseNumberAttribute(element: XMLElement, attr: string): number {
    const val = CarbonXMLSerializer.getAttribute(element, attr);
    let number = Number(val);
    if (isNaN(number)) {
      throw new CarbonXMLParseError(element.getAttributeNode(attr), `${attr} must be a number`);
    }
    return number;
  }

  deserializeElement<T extends BaseElement>(element: XMLElement): T {
    const type = CarbonXMLSerializer.getAttribute(element, 'type');
    const id = CarbonXMLSerializer.getAttribute(element, 'id');
    const x = CarbonXMLSerializer.parseNumberAttribute(element, 'x');
    const y = CarbonXMLSerializer.parseNumberAttribute(element, 'y');
    if (!this.factories.get(type)) {
      throw new CarbonParseError(`Cant parse element of type: ${type}`);
    }
    const baseElement = this.factories.get(type).generateElement();
    baseElement.id = id;
    baseElement.x = x;
    baseElement.y = y;
    if (this.serializers.has(type)) {
      this.serializers.get(type).deSerializeXmlElement(element, baseElement);
    }
    return baseElement as unknown as T;
  }

  deserializeAtom(element: XMLElement) {
    return this.deserializeElement<Atom>(element);
  }

  serializeElement(document: XMLDocument, baseElement: BaseElement) {
    let name = NodeType.ATOM;
    if (baseElement instanceof AnnotationElement) {
      name = NodeType.ANNOTATION;
    }

    const element = document.createElement(name);
    element.setAttribute('type', `${baseElement.type}`);
    element.setAttribute('id', `${baseElement.id}`);
    element.setAttribute('x', `${Math.floor(baseElement.x)}`);
    element.setAttribute('y', `${Math.floor(baseElement.y)}`);

    if (this.serializers.has(baseElement.type)) {
      this.serializers.get(baseElement.type).serializeXmlElement(element, baseElement, document);
    }
    return element;
  }

  serializeAtom(document: XMLDocument, atom: Atom): XMLElement {
    const element = this.serializeElement(document, atom);

    atom.getInPorts().forEach((port) => {
      if (!port.linked) {
        return;
      }
      const portElement = document.createElement('port');
      if (port.points.length > 0) {
        portElement.setAttribute('points', port.points.map((p) => `${Math.floor(p.x)} ${Math.floor(p.y)}`).join(','));
      }
      portElement.setAttribute('name', port.key);
      portElement.setAttribute('linked-atom', port.linked.atom.id);
      portElement.setAttribute('linked-port', port.linked.key);
      element.appendChild(portElement);
    });

    return element;
  }

  deSerializeMolecule(text: string) {
    const moleculeParsed = parse(text);
    const molecule = new Molecule();

    // atoms
    const atoms = moleculeParsed.getElementsByTagName(NodeType.ATOM);
    Array.from(atoms).forEach((a) => {
      const atom = this.deserializeAtom(a as unknown as XMLElement);
      molecule.addAtom(atom);
    });

    // annotations
    const annotations = moleculeParsed.getElementsByTagName(NodeType.ANNOTATION);
    Array.from(annotations).forEach((a) => {
      const annotation = this.deserializeElement<AnnotationElement>(a as unknown as XMLElement);
      molecule.addAnnotation(annotation);
    });

    // setup links
    Array.from(atoms).forEach((a) => {
      for (let i = 0; i < a.childNodes.length; i++) {
        const child = a.childNodes.item(i) as unknown as XMLElement;
        if (child.tagName === 'port') {
          const linkedAtom = child.getAttribute('linked-atom');
          const linkedPort = child.getAttribute('linked-port');
          const points = child.getAttribute('points');
          if (!linkedAtom) {
            continue;
          }

          const port = molecule.getAtomById(a.getAttribute('id')).getInPort(child.getAttribute('name'));
          if (port instanceof AttributePort || port instanceof FlowPort) {
            port.link(molecule.getAtomById(linkedAtom).getOutPort(linkedPort));
          }

          if (points) {
            port.points = points.split(',').map((p) => {
              const parts = p.split(' ');
              return {
                x: Number(parts[0]),
                y: Number(parts[1])
              };
            });
          }
        }
      }
    });

    return molecule;
  }

  serializeMolecule(molecule: Molecule): string {
    const document = createDocument('carbon-molecule') as unknown as XMLDocument;
    molecule.atoms.forEach((atom) => {
      document.documentElement.appendChild(this.serializeAtom(document, atom));
    });

    molecule.annotations.forEach((annotation) => {
      document.documentElement.appendChild(this.serializeElement(document, annotation));
    });
    return prettyText(document as any);
  }
}
