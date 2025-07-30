import { Molecule } from './Molecule';
import { BaseElement } from './BaseElement';

export interface ElementFactoryOptions {
  type: string;
  label: string;
  description?: string;
  category?: string;
}

export interface GenerateElementEvent {
  molecule?: Molecule;
}

export abstract class ElementFactory<T extends BaseElement = BaseElement> {
  constructor(public options: ElementFactoryOptions) {}

  get type() {
    return this.options.type;
  }

  get label() {
    return this.options.label;
  }

  get desc() {
    return this.options.description;
  }

  get category() {
    return this.options.category;
  }

  generateElement(event?: GenerateElementEvent) {
    const element = this._generateElement(event);
    element.init(this);
    return element;
  }

  protected abstract _generateElement(event?: GenerateElementEvent): T;
}
