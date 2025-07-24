import { AtomFactory } from '@journeyapps-labs/carbon-core';
import { JsonElementSerializer, XmlAtomSerializer } from '@journeyapps-labs/carbon-copy';

export interface AbstractCarbonAtomModelOptions {
  key: string;
  label: string;
  description: string;
  category?: string;
}

export interface CustomCarbonAtomModelParam {
  type: string;
  name: string;
  label: string;
  required: boolean;
}

export interface CustomCarbonAtomModelProperty {
  type: string;
  name: string;
  label: string;
  description: string;
}

export abstract class AbstractCarbonAtomModel<T extends AtomFactory = AtomFactory> {
  options: AbstractCarbonAtomModelOptions;

  inputs: Set<CustomCarbonAtomModelParam>;
  outputs: Set<CustomCarbonAtomModelParam>;
  properties: Set<CustomCarbonAtomModelProperty>;

  constructor(protected type: string) {
    this.options = {
      key: null,
      description: null,
      label: null
    };
    this.inputs = new Set<CustomCarbonAtomModelParam>();
    this.outputs = new Set<CustomCarbonAtomModelParam>();
    this.properties = new Set<CustomCarbonAtomModelProperty>();
  }

  abstract generateAtomFactory(): T;

  abstract generateSerializers(): { xml: XmlAtomSerializer; json: JsonElementSerializer };
}
