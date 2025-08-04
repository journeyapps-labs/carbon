import { CarbonAtomSchema, getAttribute } from '@journeyapps-labs/carbon-atom-builder';
import { CustomCarbonAtomModel } from './CustomCarbonAtomModel';
import { XMLElement } from '@journeyapps/domparser';
import { PortFactory } from '@journeyapps-labs/carbon-core';

export interface ExecuteFunctionEvent {
  func: string;
  inputs: { [key: string]: any };
  properties: { [key: string]: any };
}

export interface CustomCarbonRuntimeAtomSchemaOptions {
  executeFunction: (event: ExecuteFunctionEvent) => Promise<{ [key: string]: any }>;
  portFactory: PortFactory;
}

export class CustomCarbonRuntimeAtomSchema extends CarbonAtomSchema<CustomCarbonAtomModel> {
  constructor(public options: CustomCarbonRuntimeAtomSchemaOptions) {
    super('runtime-atom');
  }

  parse(node: XMLElement): CustomCarbonAtomModel {
    const model = super.parse(node);
    getAttribute(node, 'action', (value) => (model.fn = value));
    getAttribute(node, 'color', (value) => (model.color = value));
    getAttribute(node, 'icon', (value) => (model.icon = value));
    return model;
  }

  generateCarbonModel(): CustomCarbonAtomModel {
    return new CustomCarbonAtomModel(this);
  }
}
