import { LinkModel } from '@projectstorm/react-diagrams';
import { FlowPort } from '@journeyapps-labs/carbon-core';
import { AbstractModelFactory } from '@projectstorm/react-canvas-core';
import { CarbonStormEngine } from '../CarbonStormEngine';
import { ThemedLink } from './ThemedLink';
import { AtomNodePortModel } from './atom/AtomNodePortModel';

export class FlowPortModel extends AtomNodePortModel<FlowPort> {
  constructor(port: FlowPort, engine: CarbonStormEngine) {
    super('flow', port, engine);
  }

  createLinkModel(factory?: AbstractModelFactory<LinkModel>): LinkModel {
    return new ThemedLink(this.engine, () => {
      return this.engine.theme.types.flow.color;
    });
  }
}
