import {
  Atom,
  AtomPortType,
  AttributePort,
  CarbonPortOptions,
  ExecutorAtom,
  Invocation,
  AtomFactory
} from '@journeyapps-labs/carbon-core';

export class ConversionExecutorAtom<IN, OUT> extends ExecutorAtom<null, AbstractConversionAtom> {
  constructor(
    atom: AbstractConversionAtom,
    protected cb: (input: IN) => OUT
  ) {
    super(atom);
  }

  async getAttributeValueFor(port: AttributePort, invocation: Invocation): Promise<any> {
    const input = this.atom.getInPort<AttributePort>(AbstractConversionAtom.VALUE_IN);
    const valueIn = await this.program.executors.get(port.linked.atom).getAttributeValueFor(input, invocation);
    return this.cb(valueIn);
  }
}

export abstract class AbstractConversionAtom extends Atom {
  static VALUE_IN = 'value-in';
  static VALUE_OUT = 'value-out';

  constructor(type: string) {
    super(type);
    this.addPort(
      this.generatePortIn({
        key: AbstractConversionAtom.VALUE_IN,
        type: AtomPortType.IN
      })
    );
    this.addPort(
      this.generatePortOut({
        key: AbstractConversionAtom.VALUE_OUT,
        type: AtomPortType.OUT
      })
    );
  }

  init(factory: AtomFactory) {
    super.init(factory);
    this.label = 'cast';
  }

  abstract generatePortIn(port: CarbonPortOptions);

  abstract generatePortOut(port: CarbonPortOptions);
}
