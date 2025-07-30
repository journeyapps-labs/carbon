import { ExecutorAtom } from '../core/program/ExecutorAtom';
import { ExecutorAtomContext } from '../core/program/ExecutorAtomContext';
import { AtomFactory } from '../core/basic/AtomFactory';
import { AtomPortType } from '../core/basic/AtomPort';
import { BaseParamAtom, BaseParamAtomOptions } from './primitive/BaseParamAtom';
import { Invocation } from '../core/program/Invocation';
import { AttributePort } from '../core/basic/AttributePort';

export class OutputAtomFactory extends AtomFactory<OutputAtom> {
  static TYPE = 'output';

  constructor(protected options2: BaseParamAtomOptions) {
    super({
      type: OutputAtomFactory.TYPE,
      label: 'Output',
      category: 'Core'
    });
  }

  generateAtom(event): OutputAtom {
    let label = this.options2.defaultName || 'Param';

    // auto increment the label
    if (event?.molecule) {
      const names = new Set<string>(event.molecule.getOutputNodes().map((p) => p.paramName));
      let i = 1;
      do {
        label = `param_${i}`;
        i++;
      } while (names.has(label));
    }

    return new OutputAtom({
      ...this.options2,
      defaultName: label
    });
  }
}

export class OutputExecutorAtom extends ExecutorAtom<ExecutorAtomContext, OutputAtom> {
  getValue(invocation: Invocation) {
    const linked = this.atom.getInPort<AttributePort>(OutputAtom.PORT_VALUE).linked;
    return this.program.executors.get(linked.atom).getAttributeValueFor(linked, invocation);
  }
}

export class OutputAtom extends BaseParamAtom {
  static PORT_VALUE = 'value';

  constructor(options: BaseParamAtomOptions) {
    super(OutputAtomFactory.TYPE, options, AtomPortType.IN);
  }

  protected _generateExecutorAtom(): ExecutorAtom {
    return new OutputExecutorAtom(this);
  }

  protected _regeneratePort() {
    return this.options.portFactory.generatePort(this.paramType, {
      label: 'value',
      key: OutputAtom.PORT_VALUE,
      type: AtomPortType.IN
    });
  }
}
