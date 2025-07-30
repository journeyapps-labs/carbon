import {
  AbstractCarbonAtomModel,
  CustomCarbonAtomModelParam,
  CustomCarbonAtomModelProperty
} from '../models/AbstractCarbonAtomModel';
import { XMLElement } from '@journeyapps/domparser';
import { getAttribute, getBooleanAttribute, getNodes } from '../utils';
import { MapProperty } from '@journeyapps-labs/carbon-core';

export abstract class CarbonAtomSchema<T extends AbstractCarbonAtomModel = AbstractCarbonAtomModel> {
  constructor(public type: string) {}

  parse(node: XMLElement): T {
    let model = this.generateCarbonModel();
    getAttribute(node, 'description', (v) => (model.options.description = v));
    getAttribute(node, 'label', (v) => (model.options.label = v));
    getAttribute(node, 'key', (v) => (model.options.key = v));
    getAttribute(node, 'category', (v) => (model.options.category = v));

    // get inputs
    getNodes(node, 'input').forEach((f) => {
      model.inputs.add(this.generateParam(f));
    });

    // outputs
    getNodes(node, 'output').forEach((f) => {
      model.outputs.add(this.generateParam(f));
    });

    // properties
    getNodes(node, 'property').forEach((f) => {
      const prop = this.generateProperty(f);
      if (!prop) {
        return;
      }
      model.properties.add(prop);
    });

    return model;
  }

  generateParam(node: XMLElement) {
    const param: Partial<CustomCarbonAtomModelParam> = {};
    getAttribute(node, 'type', (v) => (param.type = v));
    getAttribute(node, 'name', (v) => (param.name = v));
    getAttribute(node, 'label', (v) => (param.label = v));
    getBooleanAttribute(node, 'required', (v) => (param.required = v));
    return param as CustomCarbonAtomModelParam;
  }

  generateProperty(node: XMLElement) {
    let param: Partial<CustomCarbonAtomModelProperty> = {};
    getAttribute(node, 'type', (v) => (param.type = v));
    getAttribute(node, 'name', (v) => (param.name = v));
    getAttribute(node, 'label', (v) => (param.label = v));
    getAttribute(node, 'description', (v) => (param.description = v));

    // only support maps for now
    if (param.type !== MapProperty.TYPE) {
      return;
    }

    return param as CustomCarbonAtomModelProperty;
  }

  abstract generateCarbonModel(): T;
}
