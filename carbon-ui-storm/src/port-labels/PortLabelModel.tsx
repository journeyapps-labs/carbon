import * as React from 'react';
import {
  AbstractReactFactory,
  BaseModel,
  GenerateModelEvent,
  GenerateWidgetEvent
} from '@projectstorm/react-canvas-core';
import { PortLabelWidget } from './PortLabelWidget';
import { PortModel } from '@projectstorm/react-diagrams-core';
import { CarbonStormEngine } from '../CarbonStormEngine';
import { AttributePort } from '@journeyapps-labs/carbon-core';
import { PortTheme } from '@journeyapps-labs/carbon-ui';

export interface PortLabelModelOptions {
  port: PortModel;
  attribute: AttributePort;
  label: string;
  engine: CarbonStormEngine;
  theme: PortTheme;
}

export class PortLabelModel extends BaseModel {
  constructor(public options2: PortLabelModelOptions) {
    super({
      type: PortLabelFactory.TYPE
    });
  }

  get theme() {
    return this.options2?.theme;
  }

  get port() {
    return this.options2?.port;
  }

  get attribute() {
    return this.options2?.attribute;
  }

  set attribute(attr: AttributePort) {
    this.options2.attribute = attr;
  }

  get label() {
    return this.options2?.label;
  }

  get engine() {
    return this.options2?.engine;
  }

  uuid() {
    return this.options2.attribute.id;
  }
}

export class PortLabelFactory extends AbstractReactFactory<PortLabelModel> {
  static TYPE = 'port-label';

  constructor() {
    super(PortLabelFactory.TYPE);
  }

  generateModel(event: GenerateModelEvent): PortLabelModel {
    return new PortLabelModel(null);
  }

  generateReactWidget(event: GenerateWidgetEvent<PortLabelModel>): React.JSX.Element {
    return <PortLabelWidget engine={event.model.options2.engine} port={event.model} />;
  }
}
