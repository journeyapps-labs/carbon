import { Atom, AttributePort, ExecutorAtom, Invocation } from '@journeyapps-labs/carbon-core';

export class ValueTransformerAtomExecutor<
  INPUT extends Array<any>,
  OUTPUT,
  ATOM extends Atom = Atom
> extends ExecutorAtom<null, ATOM> {
  constructor(
    atom: ATOM,
    protected cb: (input: INPUT) => OUTPUT
  ) {
    super(atom);
  }

  async getAttributeValueFor(port: AttributePort, invocation: Invocation): Promise<OUTPUT> {
    let values: INPUT = [] as any;
    for (let port of this.atom.getInPorts<AttributePort>()) {
      const value = await this.program.executors.get(port.linked.atom).getAttributeValueFor(port.linked, invocation);
      values.push(value);
    }
    return this.cb(values);
  }
}
