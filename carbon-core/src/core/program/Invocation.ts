import { ExecutorAtom } from './ExecutorAtom';
import { FlowPort } from '../basic/FlowPort';
import * as _ from 'lodash';
import { v4 } from 'uuid';

export interface InvocationOptions {
  originContext: ExecutorAtom;
  originPort: FlowPort;
}

export interface InvocationSerialized {
  id: string;
  parents: string[];
  originAtom: string;
  originPort: string;
}

export class Invocation {
  parentInvocations: Set<Invocation>;
  id: string;

  constructor(protected options: InvocationOptions) {
    this.parentInvocations = new Set<Invocation>();
    this.id = v4();
  }

  serialize(): InvocationSerialized {
    return {
      id: this.id,
      originAtom: this.originContext.atom.id,
      originPort: this.options.originPort.key,
      parents: this.getParents().map((i) => i.id)
    };
  }

  addParent(invocation: Invocation) {
    this.parentInvocations.add(invocation);
  }

  get originContext() {
    return this.options.originContext;
  }

  get originPort() {
    return this.options.originPort;
  }

  getParents(): Invocation[] {
    let parents = [];
    for (let parent of this.parentInvocations.values()) {
      parents.push(parent, ...parent.getParents());
    }
    return _.uniq(parents);
  }

  flatten() {
    return [this, ...this.getParents()];
  }

  hasParentInvocation(invocation: Invocation) {
    for (let i of this.parentInvocations) {
      if (i === invocation) {
        return true;
      }
      let hasParent = i.hasParentInvocation(invocation);
      if (hasParent) {
        return true;
      }
    }
    return false;
  }
}
