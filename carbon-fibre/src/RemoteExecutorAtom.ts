import { ExecutorAtom, ExecutorAtomContext } from '@journeyapps-labs/carbon-core';

export class RemoteExecutorAtom extends ExecutorAtom {
  protected _generateContext(): ExecutorAtomContext {
    return undefined;
  }
}
