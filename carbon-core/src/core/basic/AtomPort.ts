import { Atom } from './Atom';
import * as _ from 'lodash';
import { CompileEvent, CompileInterface } from '../program/CompileInterface';
import { CarbonEntity } from '../CarbonEntity';
import { BaseObserver } from '@journeyapps-labs/common-utils';

export enum AtomPortType {
  IN = 'in',
  OUT = 'out'
}

export interface CarbonPortOptions {
  key: string;
  type: AtomPortType;
  label?: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface AtomPortListener {
  willDelete: () => any;
  deleted: () => any;
  linkUpdated: () => any;
}

export abstract class AtomPort<
    O extends CarbonPortOptions = CarbonPortOptions,
    T extends AtomPort = any,
    M extends {} = {}
  >
  extends BaseObserver<AtomPortListener>
  implements CompileInterface, CarbonEntity
{
  atom: Atom;
  linked: T;
  metadata: Partial<M>;
  points: Point[];
  orderValue: any;

  constructor(protected options: O) {
    super();
    this.points = [];
    this.linked = null;
    this.metadata = {};
    this.orderValue = null;
  }

  abstract connected(): boolean;

  delete() {
    this.iterateListeners((cb) => cb.willDelete?.());
    this.clear();
    this.iterateListeners((cb) => cb.deleted?.());
  }

  putMetadata(meta: Partial<M> = {}) {
    this.metadata = {
      ...this.metadata,
      ...meta
    };
  }

  patch(options: CarbonPortOptions) {
    this.options.type = options.type;
    this.options.key = options.key;
    this.options.label = options.label;
  }

  setAtom(atom: Atom) {
    this.atom = atom;
  }

  get key() {
    return this.options.key;
  }

  get type() {
    return this.options.type;
  }

  get label() {
    return this.options.label || this.options.key;
  }

  link(port: T) {
    if (!port) {
      throw new Error(`port [${this.key}] on [${this.atom.id}:${this.atom.label}] cannot link to a null value`);
    }
    // @ts-ignore
    if (port === this) {
      throw new Error(`cannot link port to self`);
    }
    this.linked = port;
    this.iterateListeners((cb) => cb.linkUpdated?.());
  }

  clear() {
    if (!this.linked) {
      return;
    }
    if (this.linked) {
      this.linked.linked = null;
    }
    this.linked = null;
    this.iterateListeners((cb) => cb.linkUpdated?.());
  }

  compile(event: CompileEvent) {}

  get id() {
    return `${this.atom.id}-${this.key}`;
  }

  protected getComparePayload() {
    return {
      type: this.type,
      key: this.key,
      label: this.label
    };
  }

  equals(port: this): boolean {
    return _.isEqual(this.getComparePayload(), port.getComparePayload());
  }
}
