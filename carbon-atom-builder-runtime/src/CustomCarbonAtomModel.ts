import { AbstractCarbonAtomModel, getNodes, getAttribute } from '@journeyapps-labs/carbon-atom-builder';
import { CustomCarbonAtomFactory } from './CustomCarbonAtomFactory';
import { CustomCarbonRuntimeAtomSchema } from './CustomCarbonRuntimeAtomSchema';
import { CustomCarbonRuntimeAtom } from './CustomCarbonRuntimeAtom';
import { JsonElementSerializer, XmlAtomSerializer } from '@journeyapps-labs/carbon-copy';
import { XMLElement, XMLDocument } from '@journeyapps/domparser';
import { AtomImageAlignment } from '@journeyapps-labs/carbon-ui';

export class CustomCarbonAtomModel extends AbstractCarbonAtomModel<CustomCarbonAtomFactory> {
  fn: string;
  icon: string;
  color: string;

  constructor(public schema: CustomCarbonRuntimeAtomSchema) {
    super(schema.type);
    this.icon = 'cog';
    this.color = '#5439a2';
  }

  generateAtomFactory(): CustomCarbonAtomFactory {
    return new CustomCarbonAtomFactory(this);
  }

  generateSerializers(): { json: JsonElementSerializer; xml: XmlAtomSerializer } {
    return {
      json: {
        type: this.options.key,
        serializeJsonElement: (atom: CustomCarbonRuntimeAtom) => {
          const props = Array.from(atom.properties.values());
          if (props.length === 0) {
            return {};
          }
          return {
            properties: props.reduce((prev, cur) => {
              prev[cur.key] = cur.value;
              return prev;
            }, {})
          };
        },
        deSerializeJsonElement: (atom: CustomCarbonRuntimeAtom, ser: any) => {
          if (ser.properties) {
            for (let key in ser.properties) {
              atom.setPropertyValue(key, ser.properties[key]);
            }
          }
        }
      },
      xml: {
        type: this.options.key,
        serializeXmlElement: (node: XMLElement, atom: CustomCarbonRuntimeAtom, document: XMLDocument) => {
          atom.properties.forEach((p) => {
            const property = document.createElement('property');
            property.setAttribute('name', p.key);
            property.textContent = JSON.stringify(p.value);
            node.appendChild(property);
          });
          return node;
        },
        deSerializeXmlElement: (node: XMLElement, atom: CustomCarbonRuntimeAtom) => {
          getNodes(node, 'property').forEach((propertyNode) => {
            let name;
            getAttribute(propertyNode, 'name', (v) => {
              name = v;
            });
            if (name) {
              atom.setPropertyValue(name, JSON.parse(propertyNode.textContent));
            }
          });
        }
      }
    };
  }

  generateAtomUI() {
    return {
      type: this.options.key,
      color: this.color,
      tooltip: this.options.description,
      meta: {
        // fn: (atom: CustomCarbonRuntimeAtom) => {
        //   return atom.model.fn;
        // }
      },
      image: {
        src: require('../media/cog.png'),
        height: 50,
        alignment: AtomImageAlignment.CENTER
      }
    };
  }
}
