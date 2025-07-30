import { v4 } from 'uuid';

export interface BaseObserverInterface<T extends BaseListener> {
  registerListener(listener: Partial<T>): () => void;
}

export type BaseListener = {
  [key: string]: (event?: any) => any;
};

export class BaseObserver<T extends BaseListener = BaseListener> implements BaseObserverInterface<T> {
  private listeners: { [id: string]: Partial<T> };
  private locked: boolean;

  constructor() {
    this.listeners = {};
    this.locked = false;
  }

  fireWithoutEvents(cb: () => any) {
    this.locked = true;
    cb();
    this.locked = false;
  }

  registerListener(listener: Partial<T>): () => void {
    const id = v4();
    this.listeners[id] = listener;
    return () => {
      delete this.listeners[id];
    };
  }

  iterateListeners(cb: (listener: Partial<T>) => any) {
    if (this.locked) {
      return;
    }
    for (let i in this.listeners) {
      cb(this.listeners[i]);
    }
  }
}
