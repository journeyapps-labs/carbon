import { SimpleAtom } from '../src/elements/primitive/SimpleAtom';
import { AttributePort } from '../src/core/basic/AttributePort';
import { AtomPortType } from '../src';

export class SimpleTestNumberAtom extends SimpleAtom {
  static NUMBER_IN = 'number-in';
  static NUMBER_OUT = 'number-out';

  constructor(protected options2: { message: string; sum: number; wait: number }) {
    super({
      cb: async ({ context }) => {
        await new Promise((r) => setTimeout(r, options2.wait));
        const value = await context.getAttributeValue<number>(this.getInPort(SimpleTestNumberAtom.NUMBER_IN));
        context.outState.set(this.getOutPort(SimpleTestNumberAtom.NUMBER_OUT), value + options2.sum);
        context.logger.info(options2.message);
      },
      type: 'simple-number-sum'
    });
    this.addPort(
      new AttributePort('unknown', {
        key: SimpleTestNumberAtom.NUMBER_IN,
        type: AtomPortType.IN
      })
    );
    this.addPort(
      new AttributePort('unknown', {
        key: SimpleTestNumberAtom.NUMBER_OUT,
        type: AtomPortType.OUT
      })
    );
  }
}
