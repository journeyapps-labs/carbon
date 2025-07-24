import {
  Atom,
  AtomFactory,
  AtomPortType,
  ExecutorAtom,
  ExecutorAtomContext,
  FlowPort,
  Invocation
} from '@journeyapps-labs/carbon-core';
import { BooleanPort } from '../types/BooleanPort';
import { ElementCategories } from '../types';

export class BooleanConditionAtomFactory extends AtomFactory<BooleanConditionAtom> {
  static TYPE = 'boolean-condition';

  constructor() {
    super({
      type: BooleanConditionAtomFactory.TYPE,
      label: 'Boolean condition',
      category: ElementCategories.BOOLEAN
    });
  }

  generateAtom(): BooleanConditionAtom {
    return new BooleanConditionAtom();
  }
}

export class BooleanConditionExecutorContext extends ExecutorAtomContext<BooleanConditionExecutionAtom> {
  protected async _execute(): Promise<any> {
    let value = await this.getAttributeValue<boolean>(this.executor.atom.getInPort(BooleanConditionAtom.VALUE));
    if (value) {
      this.activateFlowPort(this.executor.atom.getOutPort(BooleanConditionAtom.PORT_TRUE));
    } else {
      this.activateFlowPort(this.executor.atom.getOutPort(BooleanConditionAtom.PORT_FALSE));
    }
  }
}

export class BooleanConditionExecutionAtom extends ExecutorAtom<BooleanConditionExecutorContext, BooleanConditionAtom> {
  doInvoke(invoke: Invocation) {
    super.doInvoke(invoke);
    this.addContext(invoke, new BooleanConditionExecutorContext()).execute();
  }
}

export class BooleanConditionAtom extends Atom {
  static VALUE = 'value';

  static PORT_IN = 'in';
  static PORT_TRUE = 'TRUE';
  static PORT_FALSE = 'FALSE';

  constructor() {
    super(BooleanConditionAtomFactory.TYPE);
    this.addPort(
      new BooleanPort({
        type: AtomPortType.IN,
        key: BooleanConditionAtom.VALUE
      })
    );
    this.addPort(
      new FlowPort({
        type: AtomPortType.IN,
        key: BooleanConditionAtom.PORT_IN
      })
    );
    this.addPort(
      new FlowPort({
        type: AtomPortType.OUT,
        key: BooleanConditionAtom.PORT_TRUE
      })
    );
    this.addPort(
      new FlowPort({
        type: AtomPortType.OUT,
        key: BooleanConditionAtom.PORT_FALSE
      })
    );
  }

  protected _generateExecutorAtom(): ExecutorAtom {
    return new BooleanConditionExecutionAtom(this);
  }
}
