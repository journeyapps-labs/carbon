import { Molecule } from './Molecule';
import { v4 } from 'uuid';
import { ElementFactory } from './ElementFactory';
import { LockedObserver } from './LockedObserver';

export interface BaseElementListener {
  deleted: () => any;
  moleculeUpdated: () => any;
}

export class BaseElement<L extends BaseElementListener = BaseElementListener> extends LockedObserver<L> {
  _id: string;
  x: number;
  y: number;
  molecule: Molecule;

  constructor(public type: string) {
    super();
    this._id = null;
    this.x = 0;
    this.y = 0;
  }

  init(factory: ElementFactory) {}

  set id(id: string) {
    this._id = id;
  }

  get id() {
    if (!this._id) {
      this._id = v4();
    }
    return this._id;
  }

  delete() {
    this.iterateListeners((cb) => cb.deleted?.());
  }

  setMolecule(molecule: Molecule) {
    if (!this._id) {
      this._id = molecule.generateID();
    }
    this.molecule = molecule;
    this.iterateListeners((cb) => cb.moleculeUpdated?.());
  }
}
