import { AtomPort } from '../basic/AtomPort';
import { Atom } from '../basic/Atom';

export enum CompileResultType {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

export interface CompileResult {
  type: CompileResultType;
  message: string;
  entity: AtomPort | Atom;
}

export interface CompileEvent {
  pushResult(result: CompileResult);
}

export interface CompileInterface {
  compile(event: CompileEvent);
}
