import { Atom } from '../basic/Atom';

export interface AtomCompileErrorOptions {
  atom: Atom;
  message: string;
}

export class AtomCompileError extends Error {
  constructor(public options: AtomCompileErrorOptions) {
    super(`[Atom:${options.atom.type}] ${options.message}`);
  }
}
