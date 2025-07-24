import { Atom, AtomFactory, AtomPortType, ExecutorAtom } from '@journeyapps-labs/carbon-core';
import { ElementCategories } from '../types';
import { ValueTransformerAtomExecutor } from '../primitives/ValueTransformerAtomExecutor';
import { TextPort } from '../types/TextPort';
import { ArrayPort } from '../types/ArrayPort';

export class TextSplitAtomFactory extends AtomFactory<TextSplitAtom> {
  static TYPE = 'text-split';

  constructor() {
    super({
      category: ElementCategories.TEXT,
      label: 'Text Split',
      type: TextSplitAtomFactory.TYPE
    });
  }

  generateAtom(): TextSplitAtom {
    return new TextSplitAtom();
  }
}

export class TextSplitAtom extends Atom {
  static TOKEN = 'token';
  static VALUE = 'value';
  static OUT = 'out';

  constructor() {
    super(TextSplitAtomFactory.TYPE);
    this.addPort(
      new TextPort({
        label: 'Token',
        type: AtomPortType.IN,
        key: TextSplitAtom.TOKEN
      })
    );
    this.addPort(
      new TextPort({
        label: 'Value',
        type: AtomPortType.IN,
        key: TextSplitAtom.VALUE
      })
    );
    this.addPort(
      new ArrayPort(
        new TextPort({
          label: 'Value',
          type: AtomPortType.OUT,
          key: TextSplitAtom.OUT
        })
      )
    );
  }

  protected _generateExecutorAtom(): ExecutorAtom {
    return new ValueTransformerAtomExecutor<[string, string], string[]>(this, ([token, value]) => {
      return value.split(token);
    });
  }
}
