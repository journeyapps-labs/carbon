import { BaseListener, BaseObserver, ConsoleLoggerTransport, Logger, LogLevel } from '@journeyapps-labs/carbon-utils';
import { Molecule } from '../basic/Molecule';
import { Atom } from '../basic/Atom';
import { ExecutorAtom } from './ExecutorAtom';
import { CompileEvent, CompileResult, CompileResultType } from './CompileInterface';

export interface ProgramListener extends BaseListener {
  statusChanged: (event: { status: ProgramStatus; error?: Error }) => any;
}

export enum ProgramStatus {
  STOPPED = 'stopped',
  RUNNING = 'running',
  ERROR = 'error'
}

export interface CompileOptions {
  throw?: boolean;
}

export abstract class BaseProgram extends BaseObserver<ProgramListener> {
  status: ProgramStatus;
  executors: Map<Atom, ExecutorAtom>;
  compiled: boolean;
  logger: Logger;

  constructor(
    public molecule: Molecule,
    logger: Logger
  ) {
    super();
    this.status = ProgramStatus.STOPPED;
    this.executors = new Map<Atom, ExecutorAtom>();
    this.compiled = false;
    this.logger =
      logger ||
      new Logger({
        transport: new ConsoleLoggerTransport(),
        name: 'PROGRAM',
        level: LogLevel.DEBUG
      });
  }

  protected abstract _compile(event: CompileEvent);

  compile(options: CompileOptions = { throw: true }): CompileResult[] {
    const results: CompileResult[] = [];
    const event: CompileEvent = {
      pushResult: (result: CompileResult) => {
        results.push(result);
      }
    };
    this._compile(event);
    if (options.throw && results.some((s) => s.type === CompileResultType.ERROR)) {
      throw new Error('Compile error');
    }
    this.compiled = true;
    return results;
  }

  protected registerExecutorAtom(atom: Atom, executor: ExecutorAtom) {
    this.executors.set(atom, executor);
    executor.setProgram(this);
  }

  protected setStatus(status: ProgramStatus) {
    if (this.status !== status) {
      this.status = status;
      this.iterateListeners((cb) =>
        cb.statusChanged?.({
          status: status
        })
      );
    }
  }

  waitForProgramToStop() {
    // fire off the program and wait for it to stop
    return new Promise<Error>((resolve, reject) => {
      const cb = this.registerListener({
        statusChanged: ({ status, error }) => {
          cb();
          if (status === ProgramStatus.ERROR) {
            reject();
          } else {
            resolve(error);
          }
        }
      });
    });
  }
}
