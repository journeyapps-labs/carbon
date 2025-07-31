import { AtomFactory } from '@journeyapps-labs/carbon-core';
import { CustomCarbonRuntimeAtom } from './CustomCarbonRuntimeAtom';
import { CustomCarbonAtomModel } from './CustomCarbonAtomModel';

export class CustomCarbonAtomFactory extends AtomFactory<CustomCarbonRuntimeAtom> {
  constructor(public model: CustomCarbonAtomModel) {
    super({
      type: model.options.key,
      label: model.options.label,
      description: model.options.description,
      category: model.options.category
    });
  }

  generateAtom(): CustomCarbonRuntimeAtom {
    return new CustomCarbonRuntimeAtom({
      model: this.model
    });
  }
}
