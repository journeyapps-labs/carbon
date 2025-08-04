import { BaseObserver } from '@journeyapps-labs/common-utils';

export class LockedObserver<T> extends BaseObserver<T> {
  private locked: boolean;

  constructor() {
    super();
    this.locked = false;
  }

  fireWithoutEvents(cb: () => any) {
    this.locked = true;
    cb();
    this.locked = false;
  }

  iterateListeners(cb: (listener: Partial<T>) => any) {
    if (this.locked) {
      return;
    }
    super.iterateListeners(cb);
  }
}
