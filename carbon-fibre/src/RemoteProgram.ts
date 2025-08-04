import { Transponder } from './Transponder';
import { ProgramEventData, ProgramEvents } from './program-events';
import { BaseProgram, CompileEvent, FlowPort, Invocation, Molecule } from '@journeyapps-labs/carbon-core';
import { RemoteExecutorAtom } from './RemoteExecutorAtom';
import { RemoteExecutorAtomContext } from './RemoteExecutorAtomContext';
import { Logger, ConsoleLoggerTransport, LogLevel } from '@journeyapps-labs/common-logger';

export interface RemoteProgramOptions {
  molecule: Molecule;
  transponder: Transponder;
  logger?: Logger;
}

export class RemoteProgram extends BaseProgram {
  logger: Logger;
  invocations: Map<string, Invocation>;

  constructor(protected options: RemoteProgramOptions) {
    super(
      options.molecule,
      options.logger ||
        new Logger({
          name: 'REMOTE_PROGRAM',
          level: LogLevel.ERROR,
          transport: new ConsoleLoggerTransport()
        })
    );
    this.invocations = new Map();

    // respond to events
    this.registerHandler(ProgramEvents.STATUS_CHANGED, ({ status }) => {
      this.logger.debug(`Status changing: ${status}`);
      this.setStatus(status);
    });

    this.registerHandler(ProgramEvents.CONTEXT_CREATED, ({ context, invocation }) => {
      this.logger.debug(`Context created`);
      if (!this.invocations.has(invocation.id)) {
        let atom = this.molecule.getAtomById(invocation.originAtom);
        let i = new Invocation({
          originContext: this.executors.get(atom),
          originPort: atom.ports.get(invocation.originPort) as FlowPort
        });
        this.invocations.set(invocation.id, i);
      }

      const contextAtom = this.molecule.getAtomById(context.atom_id);
      const contextObject = new RemoteExecutorAtomContext();
      contextObject.setExecutorAtom(this.executors.get(contextAtom));
      this.executors.get(contextAtom).addContext(this.invocations.get(invocation.id), contextObject);
    });
  }

  protected _compile(event: CompileEvent) {
    for (let a of this.molecule.atoms.values()) {
      const executorAtom = new RemoteExecutorAtom(a);
      this.registerExecutorAtom(a, executorAtom);
    }
  }

  registerHandler<T extends ProgramEvents>(signal: T, cb: (data: ProgramEventData[T]) => any) {
    this.options.transponder.registerListener({
      gotSignal: (event) => {
        if (event.signal === signal) {
          cb(event.data);
        }
      }
    });
  }
}
