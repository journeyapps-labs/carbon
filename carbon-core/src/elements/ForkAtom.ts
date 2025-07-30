import { Atom } from '../core/basic/Atom';
import { ExecutorAtom } from '../core/program/ExecutorAtom';
import { ExecutorAtomContext } from '../core/program/ExecutorAtomContext';
import { AtomFactory } from '../core/basic/AtomFactory';
import { FlowPort } from '../core/basic/FlowPort';
import { AtomPortType } from '../core/basic/AtomPort';
import { Invocation } from '../core/program/Invocation';

export class ForkAtomFactory extends AtomFactory<ForkAtom> {
  static TYPE = 'fork-start';

  constructor() {
    super({
      type: ForkAtomFactory.TYPE,
      label: 'Fork Start',
      category: 'Core'
    });
  }

  generateAtom(): ForkAtom {
    return new ForkAtom();
  }
}

export class ForkAtomExecutorContext extends ExecutorAtomContext {
  constructor(
    protected invocation1,
    protected invocation2
  ) {
    super();
  }

  protected async _execute(): Promise<any> {
    const p = this.executor.atom.getOutPort<FlowPort>(ForkAtom.PORT_OUT_1);
    const p2 = this.executor.atom.getOutPort<FlowPort>(ForkAtom.PORT_OUT_2);

    // activate ports with new contexts
    this.executor.activateFlowPort(p, this.invocation1);
    this.executor.activateFlowPort(p2, this.invocation2);
  }
}

export class ForkAtomExecutor extends ExecutorAtom<ForkAtomExecutorContext> {
  doInvoke(invoke: Invocation) {
    super.doInvoke(invoke);

    const invocation_1 = this.generateInvocation(this.atom.getOutPort(ForkAtom.PORT_OUT_1));
    const invocation_2 = this.generateInvocation(this.atom.getOutPort(ForkAtom.PORT_OUT_2));

    invocation_1.addParent(invoke);
    invocation_2.addParent(invoke);
    this.addContext(invoke, new ForkAtomExecutorContext(invocation_1, invocation_2)).execute();
  }
}

export class ForkAtom extends Atom {
  static PORT_IN = 'IN';
  static PORT_OUT_1 = 'OUT-1';
  static PORT_OUT_2 = 'OUT-2';

  constructor() {
    super(ForkAtomFactory.TYPE);
    this.addPort(
      new FlowPort({
        key: ForkAtom.PORT_IN,
        type: AtomPortType.IN
      })
    );
    this.addPort(
      new FlowPort({
        key: ForkAtom.PORT_OUT_1,
        type: AtomPortType.OUT
      })
    );
    this.addPort(
      new FlowPort({
        key: ForkAtom.PORT_OUT_2,
        type: AtomPortType.OUT
      })
    );
  }

  protected _generateExecutorAtom(): ExecutorAtom {
    return new ForkAtomExecutor(this);
  }
}
