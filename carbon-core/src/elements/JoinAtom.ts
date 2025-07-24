import { Atom } from '../core/basic/Atom';
import { ExecutorAtom } from '../core/program/ExecutorAtom';
import { ExecutorAtomContext } from '../core/program/ExecutorAtomContext';
import { AtomFactory } from '../core/basic/AtomFactory';
import { FlowPort } from '../core/basic/FlowPort';
import { AtomPortType } from '../core/basic/AtomPort';
import { Invocation } from '../core/program/Invocation';
import * as _ from 'lodash';
import { EnumProperty } from '../core/properties/EnumProperty';

export class JoinAtomFactory extends AtomFactory<JoinAtom> {
  static TYPE = 'Join-start';

  constructor() {
    super({
      type: JoinAtomFactory.TYPE,
      label: 'Join Start',
      category: 'Core'
    });
  }

  generateAtom(): JoinAtom {
    return new JoinAtom();
  }
}

export class JoinAtomExecutorContext extends ExecutorAtomContext {
  protected async _execute(): Promise<any> {
    const p = this.executor.atom.getOutPort<FlowPort>(JoinAtom.PORT_OUT);
    this.activateFlowPort(p);
  }
}

export class JoinAtomExecutor extends ExecutorAtom<JoinAtomExecutorContext, JoinAtom> {
  doInvoke(invoke: Invocation) {
    super.doInvoke(invoke);

    // WAIT_ONE: (use origin thread)
    if (this.atom.joinType === JoinAtomType.WAIT_ONE) {
      this.addContext(invoke, new JoinAtomExecutorContext()).execute();
      return;
    }

    // WAIT_ALL: (wait for all imports)
    const parents = invoke.flatten();
    const current_invocations = _.chain(Array.from(this.executingContexts.keys()))
      .flatMap((m) => m.flatten())
      .uniq()
      .value();

    // nothing has been started yet
    const intersections: Invocation[] = _.intersection(current_invocations, parents);
    if (intersections.length === 0) {
      const invocation = this.generateInvocation(this.atom.getOutPort(JoinAtom.PORT_OUT));
      invocation.addParent(invoke);
      this.addContext(invocation, new JoinAtomExecutorContext());
      this.logger.debug(`waiting for second invocation`);
    }
    // something has started already, find the existing one
    else {
      for (let [invocation, context] of this.executingContexts.entries()) {
        if (intersections.some((i) => invocation.hasParentInvocation(i))) {
          invocation.addParent(invoke);
          context.execute();
          return;
        }
      }
    }
  }
}

export enum JoinAtomType {
  WAIT_ALL = 'WAIT_ALL',
  WAIT_ONE = 'WAIT_ONE'
}

export enum JoinAtomProperties {
  JOIN_TYPE = 'joinType'
}

export interface JoinAtomProps {
  [JoinAtomProperties.JOIN_TYPE]: JoinAtomType;
}

export class JoinAtom extends Atom<JoinAtomProps> {
  static PORT_IN_1 = 'IN-1';
  static PORT_IN_2 = 'IN-2';
  static PORT_OUT = 'OUT-2';

  constructor(public options: { joinType: JoinAtomType } = { joinType: JoinAtomType.WAIT_ALL }) {
    super(JoinAtomFactory.TYPE);
    this.addProperty(
      new EnumProperty<JoinAtomType>({
        key: JoinAtomProperties.JOIN_TYPE,
        label: 'The type of wait condition',
        value: options.joinType,
        values: [
          {
            key: JoinAtomType.WAIT_ONE,
            desc: 'Waits for any input to be reached',
            label: 'Wait one'
          },
          {
            key: JoinAtomType.WAIT_ALL,
            desc: 'Waits for all inputs to be reached before continuing',
            label: 'Wait All'
          }
        ]
      })
    );
    this.addPort(
      new FlowPort({
        key: JoinAtom.PORT_IN_1,
        type: AtomPortType.IN
      })
    );
    this.addPort(
      new FlowPort({
        key: JoinAtom.PORT_IN_2,
        type: AtomPortType.IN
      })
    );
    this.addPort(
      new FlowPort({
        key: JoinAtom.PORT_OUT,
        type: AtomPortType.OUT
      })
    );
  }

  set joinType(type: JoinAtomType) {
    this.setPropertyValue(JoinAtomProperties.JOIN_TYPE, type);
  }

  get joinType() {
    return this.getPropertyValue(JoinAtomProperties.JOIN_TYPE);
  }

  protected _generateExecutorAtom(): ExecutorAtom {
    return new JoinAtomExecutor(this);
  }
}
