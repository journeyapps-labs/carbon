import { AtomUI } from './AtomUI';
import * as _ from 'lodash';

export class AtomUIBank {
  ui: Map<string, AtomUI>;

  constructor() {
    this.ui = new Map();
  }

  registerUI(ui: AtomUI) {
    this.ui.set(ui.type, ui);
  }

  getUIForAtomType = _.memoize((type: string): AtomUI => {
    return this.ui.get(type);
  });
}
