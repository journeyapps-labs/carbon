import { Atom, AtomFactory, AtomPortType, ExecutorAtom } from '@journeyapps-labs/carbon-core';
import { ElementCategories } from '../types';
import { ValueTransformerAtomExecutor } from '../primitives/ValueTransformerAtomExecutor';
import { TextPort } from '../types/TextPort';
import { ArrayPort } from '../types/ArrayPort';

export class TextJoinAtomFactory extends AtomFactory<TextJoinAtom> {
  static TYPE = 'text-join';

  constructor() {
    super({
      category: ElementCategories.TEXT,
      label: 'Text Join',
      type: TextJoinAtomFactory.TYPE
    });
  }

  generateAtom(): TextJoinAtom {
    return new TextJoinAtom();
  }
}

export class TextJoinAtom extends Atom {
  static TOKEN = 'token';
  static VALUE = 'value';
  static OUT = 'out';

  constructor() {
    super(TextJoinAtomFactory.TYPE);
    this.addPort(
      new TextPort({
        label: 'Token',
        type: AtomPortType.IN,
        key: TextJoinAtom.TOKEN
      })
    );
    this.addPort(
      new ArrayPort(
        new TextPort({
          label: 'Value',
          type: AtomPortType.IN,
          key: TextJoinAtom.VALUE
        })
      )
    );
    this.addPort(
      new TextPort({
        label: 'Value',
        type: AtomPortType.OUT,
        key: TextJoinAtom.OUT
      })
    );
  }

  protected _generateExecutorAtom(): ExecutorAtom {
    return new ValueTransformerAtomExecutor<[string, string[]], string>(this, ([token, value]) => {
      return value.join(token);
    });
  }
}
