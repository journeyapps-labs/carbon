import { Atom } from '../core/basic/Atom';
import { ExecutorAtom } from '../core/program/ExecutorAtom';
import { ExecutorAtomContext } from '../core/program/ExecutorAtomContext';
import { AtomFactory } from '../core/basic/AtomFactory';
import { FlowPort } from '../core/basic/FlowPort';
import { AtomPortType } from '../core/basic/AtomPort';
import { ProgramStatus } from '../core/program/BaseProgram';
import { Invocation } from '../core/program/Invocation';
import { CompileEvent } from '../core/program/CompileInterface';

export class ProgramStartFactory extends AtomFactory<ProgramStartAtom> {
  static TYPE = 'program-start';

  constructor() {
    super({
      type: ProgramStartFactory.TYPE,
      label: 'Start',
      category: 'Core'
    });
  }

  generateAtom(): ProgramStartAtom {
    return new ProgramStartAtom();
  }
}

export class ProgramStartExecutorContext extends ExecutorAtomContext {
  protected async _execute(): Promise<any> {
    const p = this.executor.atom.getOutPort<FlowPort>(ProgramStartAtom.PORT_START);
    this.activateFlowPort(p);
  }
}

export class ProgramStartExecutor extends ExecutorAtom<ProgramStartExecutorContext> {
  compile(event: CompileEvent) {
    super.compile(event);
    this.program.registerListener({
      statusChanged: ({ status }) => {
        if (status === ProgramStatus.RUNNING) {
          const invocation = this.generateInvocation(this.atom.getOutPort(ProgramStartAtom.PORT_START));
          this.invoke(invocation);
        }
      }
    });
  }

  protected doInvoke(invocation: Invocation) {
    super.doInvoke(invocation);
    // create a new context
    this.addContext(invocation, new ProgramStartExecutorContext()).execute();
  }

  protected _generateContext(): ExecutorAtomContext {
    return new ProgramStartExecutorContext();
  }
}

export class ProgramStartAtom extends Atom {
  static PORT_START = 'START';

  constructor() {
    super(ProgramStartFactory.TYPE);
    this.addPort(
      new FlowPort({
        key: ProgramStartAtom.PORT_START,
        type: AtomPortType.OUT
      })
    );
  }

  protected _generateExecutorAtom(): ExecutorAtom {
    return new ProgramStartExecutor(this);
  }
}
