import { CarbonStormEngine, StormUIBank } from '@journeyapps-labs/carbon-ui-storm';
import * as CElements from '@journeyapps-labs/carbon-elements-ui';
import { createMolecule } from '../fixtures/complex-molecule';
import { CARBON_DARK_ELEMENTS } from '@journeyapps-labs/carbon-elements-ui';

export const generateEngine = () => {
  const { model } = createMolecule();
  const stormBank = new StormUIBank();
  const engine = new CarbonStormEngine({
    uiBank: stormBank,
    defaultTheme: CARBON_DARK_ELEMENTS,
    context: {
      showDropDown: () => {},
      showInput: async () => {
        return null;
      },
      showCheckboxDropDown: async () => {
        return null;
      }
    }
  });

  const bank_elements = CElements.generateAtomUIBank();

  CElements.registerStormUI(stormBank);

  stormBank.loadUIBank(bank_elements);

  return engine;
};
