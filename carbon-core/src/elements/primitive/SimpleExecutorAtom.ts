import { Invocation } from '../../core/program/Invocation';
import { ExecutorAtomContext } from '../../core/program/ExecutorAtomContext';
import { ExecutorAtom } from '../../core/program/ExecutorAtom';
import { Atom } from '../../core/basic/Atom';

export type SimpleExecutorCallback = (event: {
  context: SimpleExecutorContext;
  invocation: Invocation;
}) => Promise<any>;

export class SimpleExecutorContext extends ExecutorAtomContext<SimpleExecutorAtom> {
  constructor(
    protected cb: SimpleExecutorCallback,
    protected outPort
  ) {
    super();
  }

  protected async _execute(): Promise<any> {
    this.logger.debug('Running callback function');
    await this.cb({
      context: this,
      invocation: this.invocation
    });
    this.logger.debug('callback complete');
    this.activateFlowPort(this.executor.atom.getOutPort(this.outPort));
  }
}

export class SimpleExecutorAtom<T extends Atom = Atom> extends ExecutorAtom<SimpleExecutorContext, T> {
  constructor(
    atom: T,
    protected outPort,
    protected cb: SimpleExecutorCallback
  ) {
    super(atom);
  }

  doInvoke(invoke: Invocation) {
    super.doInvoke(invoke);
    this.addContext(invoke, new SimpleExecutorContext(this.cb, this.outPort)).execute();
  }
}
