import { Transponder } from './Transponder';
import { ProgramEventData, ProgramEvents } from './program-events';
import { BaseProgram } from '@journeyapps-labs/carbon-core';

export interface ProgramTransmitterOptions {
  program: BaseProgram;
  transponder: Transponder;
}

export class ProgramTransmitter {
  constructor(protected options: ProgramTransmitterOptions) {
    options.program.registerListener({
      statusChanged: ({ status }) => {
        this.emit(ProgramEvents.STATUS_CHANGED, {
          status: status
        });
      }
    });
  }

  init() {
    // program must be compiled
    if (!this.options.program.compiled) {
      throw new Error('Transmitter can only init once program is compiled');
    }

    for (let executor of this.options.program.executors.values()) {
      executor.registerListener({
        contextGenerated: ({ context, invocation }) => {
          this.emit(ProgramEvents.CONTEXT_CREATED, {
            context: context.serialize(),
            invocation: invocation.serialize()
          });
          context.registerListener({
            started: () => {
              this.emit(ProgramEvents.CONTEXT_STATUS_CHANGE, { context_id: context.id, running: true });
            },
            completed: ({ success }) => {
              this.emit(ProgramEvents.CONTEXT_STATUS_CHANGE, { context_id: context.id, running: false });
            }
          });
        }
      });
    }
  }

  emit<T extends ProgramEvents>(status: T, data: ProgramEventData[T]) {
    this.options.transponder.emit({
      signal: status,
      data: data
    });
  }
}
