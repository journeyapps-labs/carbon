import { EnumProperty, EnumPropertyValue } from '../../core/properties/EnumProperty';
import { Atom } from '../../core/basic/Atom';
import { Molecule } from '../../core/basic/Molecule';

export const generateVariablePropertyEnumVars = (molecule: Molecule): EnumPropertyValue<string>[] => {
  return molecule.getVariableNodes().map((v) => {
    return {
      key: v.paramName,
      label: v.paramName
    };
  });
};

export class VariableProperty extends EnumProperty<string> {
  private listener1: () => any;

  constructor(key: string) {
    super({
      values: [],
      value: null,
      label: 'Variable',
      key: key
    });
  }

  dispose() {
    super.dispose();
    this.listener1?.();
  }

  get variableType() {
    return this.atom?.molecule?.getVariableNodes().find((v) => v.paramName === this.value)?.paramType;
  }

  setAtom(atom: Atom) {
    super.setAtom(atom);
    const l = atom.registerListener({
      moleculeUpdated: () => {
        if (atom.molecule) {
          this.listener1 = atom.molecule.registerListener({
            elementsUpdated: () => {
              this.setValues(generateVariablePropertyEnumVars(atom.molecule));
            }
          });
          l?.();
          this.setValues(generateVariablePropertyEnumVars(atom.molecule));
        }
      }
    });
  }
}
