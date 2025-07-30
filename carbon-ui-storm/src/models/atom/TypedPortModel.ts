import { LinkModel } from '@projectstorm/react-diagrams';
import { AttributePort } from '@journeyapps-labs/carbon-core';
import { AbstractModelFactory } from '@projectstorm/react-canvas-core';
import { ThemedLink } from '../ThemedLink';
import { CarbonStormEngine } from '../../CarbonStormEngine';
import { AtomNodePortModel } from './AtomNodePortModel';

export class TypedPortModel extends AtomNodePortModel<AttributePort> {
  constructor(port: AttributePort, engine: CarbonStormEngine) {
    super('attribute', port, engine);
  }

  createLinkModel(factory?: AbstractModelFactory<LinkModel>): LinkModel {
    const l = new ThemedLink(this.engine, () => {
      return this.engine.theme.types[this.port.valueType]?.color || 'white';
    });
    l.setWidth(1.7);
    return l;
  }
}
