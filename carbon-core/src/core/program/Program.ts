import { BaseProgram, ProgramStatus } from './BaseProgram';
import { ExecutorAtomContext } from './ExecutorAtomContext';
import { Molecule } from '../basic/Molecule';
import { CompileEvent } from './CompileInterface';
import { AtomCompileError } from './AtomCompileError';
import { Logger } from '@journeyapps-labs/common-logger';

export interface ProgramOptions {
  logger?: Logger;
}

export interface ProgramResult<T extends {} = {}> {
  params: T;
}

export class Program extends BaseProgram {
  contextsEnqueued: Set<ExecutorAtomContext>;
  params: object;
  output: object;
  variables: object;

  constructor(
    molecule: Molecule,
    protected options?: ProgramOptions
  ) {
    super(molecule, options?.logger);
    this.params = {};
    this.output = {};
    this.variables = {};
    this.contextsEnqueued = new Set();
  }

  protected _compile(event: CompileEvent) {
    for (let atom of this.molecule.atoms) {
      const executor = atom.generateExecutorAtom();
      if (!executor) {
        throw new AtomCompileError({
          atom: atom,
          message: 'did not generate executor'
        });
      }
      this.registerExecutorAtom(atom, executor);
    }

    for (let executor of this.executors.values()) {
      executor.compile(event);
    }
  }

  stop() {
    this.logger.debug(`Program stopping`);
    this.setStatus(ProgramStatus.STOPPED);
  }

  run<T>(params: object = {}): Promise<ProgramResult<T>> {
    this.logger.debug(`Program starting`);
    this.params = params;
    this.setStatus(ProgramStatus.RUNNING);
    return new Promise<ProgramResult<T>>((resolve, reject) => {
      this.registerListener({
        statusChanged: ({ status, error }) => {
          if (status === ProgramStatus.STOPPED) {
            resolve({
              params: this.output as unknown as T
            });
          } else if (status === ProgramStatus.ERROR) {
            reject(error);
          }
        }
      });
    });
  }
}
