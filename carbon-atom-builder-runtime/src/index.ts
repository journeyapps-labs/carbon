import { CarbonSchemaModel } from '@journeyapps-labs/carbon-atom-builder';
import { AtomUIBank } from '@journeyapps-labs/carbon-ui';
import { CustomCarbonAtomModel } from './CustomCarbonAtomModel';

export * from './CustomCarbonAtomModel';
export * from './CustomCarbonAtomFactory';
export * from './CustomCarbonRuntimeAtomSchema';
export * from './CustomCarbonRuntimeAtom';

export const generateAtomUIBank = (model: CarbonSchemaModel) => {
  const bank = new AtomUIBank();
  for (let m of model.atoms) {
    if (m instanceof CustomCarbonAtomModel) {
      bank.registerUI(m.generateAtomUI());
    }
  }
  return bank;
};
