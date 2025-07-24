import { GenerateWidgetEvent } from '@projectstorm/react-canvas-core';
import { StormUIBank } from './StormUIBank';
import { CarbonStormEngine } from '../CarbonStormEngine';
import { Atom } from '@journeyapps-labs/carbon-core';
import { AtomNodeModel } from '../models/atom/AtomNodeModel';

export interface StormAtomUIRenderEvent<A extends Atom = Atom> {
  event: GenerateWidgetEvent<AtomNodeModel<A>>;
  engine: CarbonStormEngine;
  readonly: boolean;
}

export abstract class StormAtomUI {
  bank: StormUIBank;

  constructor(public type: string) {}

  setStormUIBank(bank: StormUIBank) {
    this.bank = bank;
  }

  abstract render(event: StormAtomUIRenderEvent): React.JSX.Element;
}
