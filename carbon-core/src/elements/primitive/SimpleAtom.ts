import { Atom } from '../../core/basic/Atom';
import { FlowPort } from '../../core/basic/FlowPort';
import { AtomPortType } from '../../core/basic/AtomPort';
import { SimpleExecutorAtom, SimpleExecutorCallback } from './SimpleExecutorAtom';

export interface SimpleAtomOptions {
  type: string;
  cb: SimpleExecutorCallback;
}

export class SimpleAtom extends Atom {
  static PORT_IN = 'port-in';
  static PORT_OUT = 'port-out';

  constructor(public options: SimpleAtomOptions) {
    super(options.type);
    this.addPort(
      new FlowPort({
        key: SimpleAtom.PORT_IN,
        type: AtomPortType.IN
      })
    );
    this.addPort(
      new FlowPort({
        key: SimpleAtom.PORT_OUT,
        type: AtomPortType.OUT
      })
    );
  }

  protected _generateExecutorAtom(): SimpleExecutorAtom {
    return new SimpleExecutorAtom(this, SimpleAtom.PORT_OUT, this.options.cb);
  }
}
