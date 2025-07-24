import { BaseListener, BaseObserver, Logger } from '@journeyapps-labs/carbon-utils';
import { ExecutorAtom } from './ExecutorAtom';
import { FlowPort } from '../basic/FlowPort';
import { Invocation } from './Invocation';
import { AttributePort } from '../basic/AttributePort';
import { v4 } from 'uuid';
import { Program } from './Program';
import { ProgramStatus } from './BaseProgram';

export interface ExecutorAtomContextListener extends BaseListener {
  started: () => any;
  completed: (event: { success: boolean; error?: Error }) => any;
}

export interface ExecutorAtomContextSerialized {
  id: string;
  atom_id: string;
}

export abstract class ExecutorAtomContext<
  T extends ExecutorAtom = ExecutorAtom<any>,
  V extends { [key: string]: any } = {}
> extends BaseObserver<ExecutorAtomContextListener> {
  logger: Logger;
  outState: Map<AttributePort, any>;

  executor: T;
  invocation: Invocation;
  id: string;

  portExecutionQueue: Set<FlowPort>;

  constructor() {
    super();
    this.outState = new Map<AttributePort, any>();
    this.portExecutionQueue = new Set();
    this.id = v4();
  }

  serialize(): ExecutorAtomContextSerialized {
    return {
      id: this.id,
      atom_id: this.executor.atom.id
    };
  }

  setInvocation(invocation: Invocation) {
    this.invocation = invocation;
  }

  activateFlowPort(port: FlowPort) {
    // add it to the queue, and only fire this when the execution itself has finished (helps with race conditions)
    this.portExecutionQueue.add(port);
  }

  get program() {
    return this.executor.program as Program;
  }

  async getAttributeValues(): Promise<Partial<V>> {
    const attributes = await Promise.all(
      this.executor.atom
        .getInPorts()
        .filter((p) => p instanceof AttributePort)
        .map((r: AttributePort) =>
          this.getAttributeValue(r).then((v) => {
            return { [r.key]: v };
          })
        )
    );
    return attributes.reduce((prev, cur) => {
      return {
        ...prev,
        ...cur
      };
    }, {}) as Partial<V>;
  }

  async getAttributeValue<T>(inputPort: AttributePort): Promise<T> {
    if (!inputPort.linked) {
      // default value to NULL
      if (!inputPort.required) {
        return null;
      }

      throw new Error(
        'Input is missing a connection (this should not happen since it should be caught by compilation)'
      );
    }

    const executor = this.executor.program.executors.get(inputPort.linked.atom);
    this.logger.debug(`fetching value from parent atom: ${executor.atom.type}`);
    const value = await executor.getAttributeValueFor(inputPort.linked, this.invocation);
    this.logger.debug(`got value: `, value);
    return value;
  }

  setExecutorAtom(atom: T) {
    this.executor = atom;
    this.logger = atom.logger.createLogger('context');
  }

  async execute() {
    this.logger.debug('Executing');
    this.iterateListeners((cb) => cb.started?.());
    try {
      await this._execute();
      this.iterateListeners((cb) =>
        cb.completed({
          success: true
        })
      );

      // do not continue if the over arching program has stopped
      if (this.program.status !== ProgramStatus.RUNNING) {
        return;
      }

      // now execute the ports that were queued
      for (let port of this.portExecutionQueue) {
        this.executor.activateFlowPort(port, this.invocation);
      }
    } catch (ex) {
      this.logger.error(ex);
      this.iterateListeners((cb) =>
        cb.completed({
          success: false,
          error: ex
        })
      );
    }
  }

  protected abstract _execute(): Promise<any>;
}
