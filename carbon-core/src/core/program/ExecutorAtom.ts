import { BaseListener, BaseObserver, Logger } from '@journeyapps-labs/carbon-utils';
import { ExecutorAtomContext } from './ExecutorAtomContext';
import { Atom } from '../basic/Atom';
import { FlowPort } from '../basic/FlowPort';
import { Invocation } from './Invocation';
import { AttributePort } from '../basic/AttributePort';
import { BaseProgram, ProgramStatus } from './BaseProgram';
import { CompileEvent, CompileInterface } from './CompileInterface';

export interface ExecutorAtomListener<T extends ExecutorAtomContext = ExecutorAtomContext> extends BaseListener {
  contextGenerated: (event: { context: T; invocation: Invocation }) => any;
  invocationGenerated: (event: { invocation: Invocation }) => any;
  pausedChanged: () => any;
  breakOnPause: () => any;
}

export abstract class ExecutorAtom<T extends ExecutorAtomContext = ExecutorAtomContext, A extends Atom = Atom>
  extends BaseObserver<ExecutorAtomListener<T>>
  implements CompileInterface
{
  executingContexts: Map<Invocation, T>;
  paused: boolean;
  program: BaseProgram;
  logger: Logger;

  constructor(public atom: A) {
    super();
    this.executingContexts = new Map<Invocation, T>();
    this.paused = false;
    this.program = null;
  }

  setProgram(program: BaseProgram) {
    this.program = program;
    this.logger = program.logger.createLogger(`Executor:${this.atom.type}`);
  }

  setPaused(pause = true) {
    if (pause === this.paused) {
      return;
    }
    this.paused = pause;
    this.iterateListeners((cb) => cb.pausedChanged?.());
  }

  getExecutionContextForInvocation(invocation: Invocation): T {
    for (let i of invocation.flatten()) {
      if (this.executingContexts.has(i)) {
        return this.executingContexts.get(i);
      }
    }
    return null;
  }

  generateInvocation(port: FlowPort) {
    const invocation = new Invocation({
      originContext: this,
      originPort: port
    });
    this.iterateListeners((cb) => cb.invocationGenerated?.({ invocation: invocation }));
    return invocation;
  }

  async getAttributeValueFor(outPort: AttributePort, invocation: Invocation): Promise<any> {
    const context = this.getExecutionContextForInvocation(invocation);
    return context.outState.get(outPort);
  }

  protected doInvoke(invoke: Invocation) {
    this.logger.debug(`invoking`);
  }

  invoke(invoke: Invocation) {
    if (!this.paused) {
      this.doInvoke(invoke);
    } else {
      this.iterateListeners((cb) => cb.breakOnPause?.());
      const l = this.registerListener({
        pausedChanged: () => {
          this.doInvoke(invoke);
          l?.();
        }
      });
    }
  }

  compile(event: CompileEvent) {
    this.logger.debug(`compiling`);
    this.atom.getInPorts().forEach((port) => {
      port.compile(event);
    });
    this.atom.getOutPorts().forEach((port) => {
      port.compile(event);
    });
  }

  activateFlowPort(port: FlowPort, invocation: Invocation) {
    this.logger.debug(`Activating port: ${port.key} with invocation ${invocation.id}`);
    const linkedAtom = port.linked.atom;
    this.logger.debug(`Activating atom: ${linkedAtom.type}`);
    const linkedExecutor = this.program.executors.get(linkedAtom);
    linkedExecutor.invoke(invocation);
  }

  addContext(invocation: Invocation, context: T): T {
    context.registerListener({
      completed: ({ success, error }) => {
        if (!success) {
          this.program.iterateListeners((cb) =>
            cb.statusChanged({
              status: ProgramStatus.ERROR,
              error: error
            })
          );
        }
      }
    });
    context.setExecutorAtom(this);
    context.setInvocation(invocation);
    this.executingContexts.set(invocation, context);
    this.iterateListeners((cb) =>
      cb.contextGenerated?.({
        context,
        invocation
      })
    );
    return context;
  }
}
