import { Atom } from './Atom';
import { ElementFactory, GenerateElementEvent } from './ElementFactory';

export abstract class AtomFactory<T extends Atom = Atom> extends ElementFactory<T> {
  _generateElement(event?: GenerateElementEvent): T {
    return this.generateAtom(event);
  }

  abstract generateAtom(event?: GenerateElementEvent): T;
}
