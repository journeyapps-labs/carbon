import {
  Atom,
  AtomFactory,
  AtomPortType,
  ExecutorAtom,
  ExecutorAtomContext,
  FlowPort,
  Invocation
} from '@journeyapps-labs/carbon-core';
import { NumericPort } from '../types/NumericPort';
import { ElementCategories } from '../types';

export class WaitAtomFactory extends AtomFactory<WaitAtom> {
  static TYPE = 'core-wait';

  constructor() {
    super({
      category: ElementCategories.CORE,
      label: 'Wait',
      type: WaitAtomFactory.TYPE
    });
  }

  generateAtom(): WaitAtom {
    return new WaitAtom();
  }
}

export class WaitExecutionAtomContext extends ExecutorAtomContext<WaitExecutorAtom> {
  protected async _execute(): Promise<any> {
    const value = await this.getAttributeValue<number>(this.executor.atom.getInPort<NumericPort>(WaitAtom.WAIT));
    await new Promise((resolve) => {
      setTimeout(resolve, value);
    });
    this.activateFlowPort(this.executor.atom.getOutPort<FlowPort>(WaitAtom.PORT_OUT));
  }
}

export class WaitExecutorAtom extends ExecutorAtom<WaitExecutionAtomContext, WaitAtom> {
  protected doInvoke(invoke: Invocation) {
    this.addContext(invoke, new WaitExecutionAtomContext()).execute();
  }
}

export class WaitAtom extends Atom {
  static PORT_IN = 'in';
  static WAIT = 'wait-ms';
  static PORT_OUT = 'out';

  constructor() {
    super(WaitAtomFactory.TYPE);
    this.addPort(
      new FlowPort({
        key: WaitAtom.PORT_IN,
        type: AtomPortType.IN
      })
    );
    this.addPort(
      new NumericPort({
        key: WaitAtom.WAIT,
        type: AtomPortType.IN,
        label: 'time ms'
      })
    );
    this.addPort(
      new FlowPort({
        key: WaitAtom.PORT_OUT,
        type: AtomPortType.OUT
      })
    );
  }

  protected _generateExecutorAtom(): ExecutorAtom {
    return new WaitExecutorAtom(this);
  }
}
