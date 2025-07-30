import { CarbonSchemaModel } from '../models/CarbonSchemaModel';
import { CarbonAtomSchema } from './CarbonAtomSchema';
import { parse } from '@journeyapps/core-xml';
import { XMLElement } from '@journeyapps/domparser';

export class CarbonXmlSchemaParser {
  schemas: Set<CarbonAtomSchema>;

  constructor() {
    this.schemas = new Set<CarbonAtomSchema>();
  }

  registerAtomSchema(schema: CarbonAtomSchema) {
    this.schemas.add(schema);
  }

  parse(xml: string): CarbonSchemaModel {
    const document = parse(xml);
    const root = Array.from(document.childNodes).find((n) => n.nodeName === 'carbon-schema') as unknown as XMLElement;
    let globalCategory = root?.attributes.getNamedItem('category')?.value?.trim();
    if (globalCategory === '') {
      globalCategory = null;
    }
    const model = new CarbonSchemaModel();
    for (let s of this.schemas) {
      const elements = document.getElementsByTagName(s.type);
      Array.from(elements).forEach((element) => {
        const node = s.parse(element as unknown as XMLElement);
        if (!node.options.category && globalCategory) {
          node.options.category = globalCategory;
        }
        model.addAtomModel(node);
      });
    }
    return model;
  }
}
