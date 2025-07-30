import { ExecutorAtomContextSerialized, InvocationSerialized, ProgramStatus } from '@journeyapps-labs/carbon-core';

export enum ProgramEvents {
  STATUS_CHANGED = 'status-changed',
  CONTEXT_CREATED = 'context-created',
  CONTEXT_STATUS_CHANGE = 'context-completed'
}

export interface ProgramEventData {
  [ProgramEvents.STATUS_CHANGED]: { status: ProgramStatus };
  [ProgramEvents.CONTEXT_CREATED]: { context: ExecutorAtomContextSerialized; invocation: InvocationSerialized };
  [ProgramEvents.CONTEXT_STATUS_CHANGE]: { context_id: string; running: boolean };
}
