import { BaseObserver } from '@journeyapps-labs/common-utils';

export interface TransponderEvent {
  signal: string;
  data: any;
}

export interface TransponderListener {
  gotSignal: (event: TransponderEvent) => any;
}

export abstract class Transponder extends BaseObserver<TransponderListener> {
  abstract emit(event: TransponderEvent);
}
