import {
  Atom,
  AtomFactory,
  AtomPortType,
  AttributePort,
  ExecutorAtom,
  Invocation
} from '@journeyapps-labs/carbon-core';
import { ElementCategories } from '../types';
import { DatePort } from '../types/DatePort';

export class CurrentDateAtomFactory extends AtomFactory<CurrentDateAtom> {
  static TYPE = 'current-date';

  constructor() {
    super({
      type: CurrentDateAtomFactory.TYPE,
      label: 'Current Date',
      category: ElementCategories.DATE
    });
  }

  generateAtom(): CurrentDateAtom {
    return new CurrentDateAtom();
  }
}

export class CurrentDateExecutorAtom extends ExecutorAtom {
  async getAttributeValueFor(port: AttributePort, invocation: Invocation): Promise<any> {
    return new Date();
  }
}

export class CurrentDateAtom extends Atom {
  constructor() {
    super(CurrentDateAtomFactory.TYPE);
    this.addPort(
      new DatePort({
        type: AtomPortType.OUT,
        label: 'now',
        key: 'now'
      })
    );
  }

  protected _generateExecutorAtom(): ExecutorAtom {
    return new CurrentDateExecutorAtom(this);
  }
}
