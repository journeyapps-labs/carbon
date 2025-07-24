import { Atom } from './Atom';
import { ParamAtom, ParamAtomFactory } from '../../elements/ParamAtom';
import { OutputAtom, OutputAtomFactory } from '../../elements/OutputAtom';
import { SetVariableAtom, SetVariableAtomFactory } from '../../elements/SetVariableAtom';
import { BaseListener, BaseObserver } from '@journeyapps-labs/carbon-utils';
import { BaseElement } from './BaseElement';
import { AnnotationElement } from '../../elements/annotation/AnnotationElement';

export interface MoleculeListener extends BaseListener {
  elementsUpdated: () => any;
}

export class Molecule extends BaseObserver<MoleculeListener> {
  elements: Set<BaseElement>;
  annotations: Set<AnnotationElement>;
  atoms: Set<Atom>;
  id: number;

  constructor() {
    super();
    this.elements = new Set<BaseElement>();
    this.atoms = new Set<Atom>();
    this.annotations = new Set<AnnotationElement>();
    this.id = 0;
  }

  getParamNodes(): ParamAtom[] {
    return Array.from(this.atoms.values()).filter((a) => a.type === ParamAtomFactory.TYPE) as ParamAtom[];
  }

  getOutputNodes(): OutputAtom[] {
    return Array.from(this.atoms.values()).filter((a) => a.type === OutputAtomFactory.TYPE) as OutputAtom[];
  }

  getVariableNodes(): SetVariableAtom[] {
    return Array.from(this.atoms.values()).filter((a) => a.type === SetVariableAtomFactory.TYPE) as SetVariableAtom[];
  }

  generateID() {
    let id = ``;
    do {
      id = `${this.id++}`;
    } while (!!this.getAtomById(id));
    return id;
  }

  getAtomById(id: string) {
    for (let atom of this.atoms.values()) {
      if (atom.id === id) {
        return atom;
      }
    }
    return null;
  }

  dispose() {
    for (let a of this.atoms.values()) {
      a.dispose();
    }
  }

  addElement(element: BaseElement) {
    if (this.elements.has(element)) {
      throw new Error(`Element already exists`);
    }
    element.setMolecule(this);
    const l = element.registerListener({
      deleted: () => {
        this.elements.delete(element);
        element.setMolecule(null);
        this.iterateListeners((cb) => cb.elementsUpdated?.());
        l?.();
      }
    });
    this.iterateListeners((cb) => cb.elementsUpdated?.());
  }

  addAnnotation(annotation: AnnotationElement) {
    this.addElement(annotation);
    const l = annotation.registerListener({
      deleted: () => {
        this.annotations.delete(annotation);
        l?.();
      }
    });
    this.annotations.add(annotation);
  }

  addAtom(atom: Atom) {
    this.addElement(atom);
    const l = atom.registerListener({
      deleted: () => {
        this.atoms.delete(atom);
        l?.();
      }
    });
    this.atoms.add(atom);
  }

  addAtoms(...atoms: Atom[]) {
    atoms.forEach((a) => this.addAtom(a));
  }
}
