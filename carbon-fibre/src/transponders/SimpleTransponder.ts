import { Transponder, TransponderEvent } from '../Transponder';

export class SimpleTransponder extends Transponder {
  other: SimpleTransponder;

  link(transponder: SimpleTransponder) {
    this.other = transponder;
    transponder.other = this;
  }

  emit(event: TransponderEvent) {
    this.other.iterateListeners((cb) => cb.gotSignal(event));
  }
}
