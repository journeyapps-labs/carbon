import { Atom } from '../core/basic/Atom';
import { ExecutorAtom } from '../core/program/ExecutorAtom';
import { ExecutorAtomContext } from '../core/program/ExecutorAtomContext';
import { AtomFactory } from '../core/basic/AtomFactory';
import { FlowPort } from '../core/basic/FlowPort';
import { AtomPortType } from '../core/basic/AtomPort';
import { Invocation } from '../core/program/Invocation';
import { OutputAtom, OutputExecutorAtom } from './OutputAtom';
import { Program } from '../core/program/Program';

export class ProgramEndFactory extends AtomFactory<ProgramEndAtom> {
  static TYPE = 'program-end';

  constructor() {
    super({
      type: ProgramEndFactory.TYPE,
      label: 'End',
      category: 'Core'
    });
  }

  generateAtom(): ProgramEndAtom {
    return new ProgramEndAtom();
  }
}

export class ProgramEndExecutorContext extends ExecutorAtomContext {
  protected async _execute(): Promise<any> {
    const nodes = this.executor.program.molecule.getOutputNodes();

    let res = {};
    for (let output of nodes) {
      res[output.paramName] = await (this.executor.program.executors.get(output) as OutputExecutorAtom).getValue(
        this.invocation
      );
    }
    (this.executor.program as Program).output = res;
    (this.executor.program as Program).stop();
  }
}

export class ProgramEndExecutor extends ExecutorAtom<ProgramEndExecutorContext> {
  doInvoke(invocation: Invocation) {
    this.addContext(invocation, new ProgramEndExecutorContext()).execute();
  }
}

export class ProgramEndAtom extends Atom {
  static PORT_END = 'END';

  constructor() {
    super(ProgramEndFactory.TYPE);
    this.addPort(
      new FlowPort({
        key: ProgramEndAtom.PORT_END,
        type: AtomPortType.IN
      })
    );
  }

  protected _generateExecutorAtom(): ExecutorAtom {
    return new ProgramEndExecutor(this);
  }
}
