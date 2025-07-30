import { ExecutorAtom } from '../core/program/ExecutorAtom';
import { ExecutorAtomContext } from '../core/program/ExecutorAtomContext';
import { AtomFactory } from '../core/basic/AtomFactory';
import { Invocation } from '../core/program/Invocation';
import { AttributePort } from '../core/basic/AttributePort';
import { Program } from '../core/program/Program';
import { AtomPortType } from '../core/basic/AtomPort';
import { BaseParamAtom, BaseParamAtomOptions } from './primitive/BaseParamAtom';
import { OutputAtom } from './OutputAtom';
import { FlowPort } from '../core/basic/FlowPort';

export class SetVariableAtomFactory extends AtomFactory<SetVariableAtom> {
  static TYPE = 'set-variable';

  constructor(protected options2: BaseParamAtomOptions) {
    super({
      type: SetVariableAtomFactory.TYPE,
      label: 'Set Variable',
      category: 'Core'
    });
  }

  generateAtom(event): SetVariableAtom {
    let label = this.options2.defaultName || 'variable';

    // auto increment the label
    if (event?.molecule) {
      const names = new Set<string>(event.molecule.getVariableNodes().map((p) => p.paramName));
      let i = 1;
      do {
        label = `variable_${i}`;
        i++;
      } while (names.has(label));
    }

    return new SetVariableAtom({
      ...this.options2,
      defaultName: label
    });
  }
}

export class SetVariableExecutorAtomContext extends ExecutorAtomContext<SetVariableExecutorAtom> {
  protected async _execute(): Promise<any> {
    const value = await this.getAttributeValue(this.executor.atom.getInPort(SetVariableAtom.PORT_VALUE));
    this.program.variables[this.executor.atom.paramName] = value;
    this.activateFlowPort(this.executor.atom.getOutPort(SetVariableAtom.FLOW_OUT));
  }
}

export class SetVariableExecutorAtom extends ExecutorAtom<SetVariableExecutorAtomContext, SetVariableAtom> {
  invoke(invoke: Invocation) {
    super.invoke(invoke);
    this.addContext(invoke, new SetVariableExecutorAtomContext()).execute();
  }
}

export class SetVariableAtom extends BaseParamAtom {
  static PORT_VALUE = 'value';
  static FLOW_IN = 'flow-in';
  static FLOW_OUT = 'flow-out';

  constructor(options: BaseParamAtomOptions) {
    super(SetVariableAtomFactory.TYPE, options, AtomPortType.IN);
    this.addPort(
      new FlowPort({
        type: AtomPortType.IN,
        key: SetVariableAtom.FLOW_IN,
        label: 'Flow in'
      })
    );
    this.addPort(
      new FlowPort({
        type: AtomPortType.OUT,
        key: SetVariableAtom.FLOW_OUT,
        label: 'Flow out'
      })
    );
  }

  protected _generateExecutorAtom(): ExecutorAtom {
    return new SetVariableExecutorAtom(this);
  }

  protected _regeneratePort() {
    return this.options.portFactory.generatePort(this.paramType, {
      label: 'value',
      key: SetVariableAtom.PORT_VALUE,
      type: AtomPortType.IN
    });
  }
}
