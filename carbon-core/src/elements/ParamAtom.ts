import { ExecutorAtom } from '../core/program/ExecutorAtom';
import { ExecutorAtomContext } from '../core/program/ExecutorAtomContext';
import { AtomFactory } from '../core/basic/AtomFactory';
import { Invocation } from '../core/program/Invocation';
import { AttributePort } from '../core/basic/AttributePort';
import { Program } from '../core/program/Program';
import { AtomPortType } from '../core/basic/AtomPort';
import { BaseParamAtom, BaseParamAtomOptions } from './primitive/BaseParamAtom';

export class ParamAtomFactory extends AtomFactory<ParamAtom> {
  static TYPE = 'param';

  constructor(protected options2: BaseParamAtomOptions) {
    super({
      type: ParamAtomFactory.TYPE,
      label: 'Parameter',
      category: 'Core'
    });
  }

  generateAtom(event): ParamAtom {
    let label = this.options2.defaultName || 'Param';

    // auto increment the label
    if (event?.molecule) {
      const names = new Set<string>(event.molecule.getParamNodes().map((p) => p.paramName));
      let i = 1;
      do {
        label = `param_${i}`;
        i++;
      } while (names.has(label));
    }

    return new ParamAtom({
      ...this.options2,
      defaultName: label
    });
  }
}

export class ParamExecutorAtom extends ExecutorAtom<ExecutorAtomContext, ParamAtom> {
  async getAttributeValueFor(port: AttributePort, invocation: Invocation): Promise<any> {
    return (this.program as Program).params[this.atom.paramName];
  }
}

export class ParamAtom extends BaseParamAtom {
  static PORT_VALUE = 'value';

  constructor(options: BaseParamAtomOptions) {
    super(ParamAtomFactory.TYPE, options, AtomPortType.OUT);
  }

  protected _generateExecutorAtom(): ExecutorAtom {
    return new ParamExecutorAtom(this);
  }

  protected _regeneratePort() {
    return this.options.portFactory.generatePort(this.paramType, {
      label: 'value',
      key: ParamAtom.PORT_VALUE,
      type: AtomPortType.OUT
    });
  }
}
