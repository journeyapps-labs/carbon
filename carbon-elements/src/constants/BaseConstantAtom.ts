import {
  Atom,
  AtomPortType,
  AttributePort,
  CarbonPortOptions,
  ExecutorAtom,
  ExecutorAtomContext,
  Invocation
} from '@journeyapps-labs/carbon-core';
import { JsonElementSerializer } from '@journeyapps-labs/carbon-copy';

export class BaseConstantExecutorAtom extends ExecutorAtom<ExecutorAtomContext, BaseConstantAtom> {
  async getAttributeValueFor(port: AttributePort, invocation: Invocation): Promise<number> {
    return this.atom.value;
  }
}

export abstract class BaseConstantAtom<T = any> extends Atom {
  static PORT = 'out';

  constructor(
    type: string,
    public value: T
  ) {
    super(type);
    this.addPort(
      this.generatePort({
        type: AtomPortType.OUT,
        key: 'out'
      })
    );
  }

  setValue(value: any) {
    this.value = this.decodeValue(value);
  }

  protected abstract decodeValue(value): T;

  protected abstract generatePort(options: CarbonPortOptions);

  get port() {
    return this.getOutPort<AttributePort>(BaseConstantAtom.PORT);
  }

  protected _generateExecutorAtom(): ExecutorAtom {
    return new BaseConstantExecutorAtom(this);
  }
}

export const generateBaseConstantJsonSerializer = (type: string) => {
  return {
    type: type,
    serializeJsonElement(atom: BaseConstantAtom) {
      return {
        value: atom.value
      };
    },
    deSerializeJsonElement(atom: BaseConstantAtom, data: any): any {
      atom.setValue(data.value);
    }
  } as JsonElementSerializer<BaseConstantAtom>;
};
