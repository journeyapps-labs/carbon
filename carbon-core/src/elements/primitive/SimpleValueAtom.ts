import { Atom } from '../../core/basic/Atom';
import { ExecutorAtom } from '../../core/program/ExecutorAtom';
import { Invocation } from '../../core/program/Invocation';
import { AtomPortType } from '../../core/basic/AtomPort';
import { AttributePort } from '../../core/basic/AttributePort';
import { ExecutorAtomContext } from '../../core/program/ExecutorAtomContext';

export class SimpleValueExecutorAtom extends ExecutorAtom<ExecutorAtomContext, SimpleValueAtom> {
  constructor(atom: SimpleValueAtom) {
    super(atom);
  }

  async getAttributeValueFor(port: AttributePort, invocation: Invocation): Promise<any> {
    return this.atom.value;
  }
}

/**
 * For testing purposes
 */
export class SimpleValueAtom extends Atom {
  static PORT_OUT = 'port-out';
  static TYPE = 'value';

  constructor(public value: any) {
    super(SimpleValueAtom.TYPE);
    this.addPort(
      new AttributePort('unknown', {
        key: SimpleValueAtom.PORT_OUT,
        type: AtomPortType.OUT
      })
    );
  }

  protected _generateExecutorAtom(): SimpleValueExecutorAtom {
    return new SimpleValueExecutorAtom(this);
  }
}
