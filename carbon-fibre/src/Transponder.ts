import { BaseListener, BaseObserver } from '@journeyapps-labs/carbon-utils';

export interface TransponderEvent {
  signal: string;
  data: any;
}

export interface TransponderListener extends BaseListener {
  gotSignal: (event: TransponderEvent) => any;
}

export abstract class Transponder extends BaseObserver<TransponderListener> {
  abstract emit(event: TransponderEvent);
}
