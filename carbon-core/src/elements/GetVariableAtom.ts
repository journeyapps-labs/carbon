import { Atom } from '../core/basic/Atom';
import { ExecutorAtom } from '../core/program/ExecutorAtom';
import { ExecutorAtomContext } from '../core/program/ExecutorAtomContext';
import { AtomFactory } from '../core/basic/AtomFactory';
import { VariableProperty } from './properties/VariableProperty';
import { PortFactory } from '../core/basic/PortFactory';
import { AtomPortType } from '../core/basic/AtomPort';
import { AttributePort } from '../core/basic/AttributePort';
import { Invocation } from '../core/program/Invocation';
import { Program } from '../core/program/Program';
import { Molecule } from '../core/basic/Molecule';
import { ParamAtomProperty } from './primitive/BaseParamAtom';
import { EnumProperty } from '../core/properties/EnumProperty';

export interface GetVariableAtomFactoryOptions {
  portFactory: PortFactory;
}

export class GetVariableAtomFactory extends AtomFactory<GetVariableAtom> {
  static TYPE = 'get-variable';

  constructor(protected options2: GetVariableAtomFactoryOptions) {
    super({
      type: GetVariableAtomFactory.TYPE,
      label: 'Get variable',
      category: 'Core'
    });
  }

  generateAtom(event): GetVariableAtom {
    const atom = new GetVariableAtom({
      ...this.options2
    });
    if (event?.molecule) {
      const variable = event.molecule.getVariableNodes()[0];
      if (variable) {
        atom.variable = variable;
      }
    }
    return atom;
  }
}

export class GetVariableExecutorAtom extends ExecutorAtom<ExecutorAtomContext, GetVariableAtom> {
  async getAttributeValueFor(port: AttributePort, invocation: Invocation): Promise<any> {
    return (this.program as Program).variables[this.atom.variable];
  }
}

export enum GetVariableAtomProperty {
  VARIABLE = 'variable'
}

export interface GetVariableAtomProperties {
  [GetVariableAtomProperty.VARIABLE]: string;
}

export interface GetVariableAtomOptions {
  portFactory: PortFactory;
}

export class GetVariableAtom extends Atom<GetVariableAtomProperties> {
  static VALUE = 'value';

  currentType: string;
  moleculeListener: () => any;

  constructor(protected options: GetVariableAtomOptions) {
    super(GetVariableAtomFactory.TYPE);
    const prop = new VariableProperty(GetVariableAtomProperty.VARIABLE);
    this.addProperty(prop).registerListener({
      propertyChanged: () => {
        this.label = prop.value;
        this.updatePorts();
      }
    });
    this.currentType = this.variableType;
  }

  setMolecule(molecule: Molecule) {
    super.setMolecule(molecule);
    let listeners: (() => any)[] = [];
    if (molecule) {
      this.moleculeListener = molecule.registerListener({
        elementsUpdated: () => {
          listeners?.forEach((l) => l());
          listeners = molecule.getVariableNodes().map((v) => {
            return (v.properties.get(ParamAtomProperty.TYPE) as EnumProperty<any>).registerListener({
              propertyChanged: () => {
                if (this.currentType !== this.variableType) {
                  this.updatePorts();
                }
              }
            });
          });
          this.updatePorts();
        }
      });
    } else {
      this.moleculeListener?.();
    }
  }

  set variable(variable: string) {
    this.setPropertyValue(GetVariableAtomProperty.VARIABLE, variable);
  }

  get variable() {
    return this.getPropertyValue(GetVariableAtomProperty.VARIABLE);
  }

  get variableType() {
    return (this.properties.get(GetVariableAtomProperty.VARIABLE) as VariableProperty).variableType;
  }

  updatePorts() {
    if (!this.variableType) {
      return;
    }
    this.replacePorts({
      type: AtomPortType.OUT,
      deleteFilter: (p) => {
        return true;
      },
      ports: [
        this.options.portFactory.generatePort(this.variableType, {
          label: 'value',
          key: GetVariableAtom.VALUE,
          type: AtomPortType.OUT
        })
      ]
    });
  }

  protected _generateExecutorAtom(): ExecutorAtom {
    return new GetVariableExecutorAtom(this);
  }
}
