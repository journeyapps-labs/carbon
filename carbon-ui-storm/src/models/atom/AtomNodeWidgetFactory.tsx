import * as React from 'react';
import { AbstractReactFactory, GenerateModelEvent, GenerateWidgetEvent } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { FlowPort } from '@journeyapps-labs/carbon-core';
import { CarbonStormEngine } from '../../CarbonStormEngine';
import { DebugAtomWidget } from '../../widgets/DebugAtomWidget';
import { AtomNodeModel } from './AtomNodeModel';

export class AtomNodeWidgetFactory extends AbstractReactFactory<AtomNodeModel, DiagramEngine> {
  static TYPE = 'atom-node';

  constructor(protected stormEngine: CarbonStormEngine) {
    super(AtomNodeWidgetFactory.TYPE);
  }

  generateModel(event: GenerateModelEvent): AtomNodeModel {
    return new AtomNodeModel(null, this.stormEngine);
  }

  generateReactWidget(event: GenerateWidgetEvent<AtomNodeModel>): React.JSX.Element {
    const node = this.stormEngine.uiBank.getUIForAtomType(event.model.atom.type).render({
      event: event,
      engine: this.stormEngine,
      readonly: false
    });

    const hasFlows = event.model.atom.getOutPorts().filter((port) => port instanceof FlowPort).length > 0;

    if (hasFlows && this.stormEngine.program) {
      return (
        <DebugAtomWidget node={event.model} executor={this.stormEngine.program.executors.get(event.model.atom)}>
          {node}
        </DebugAtomWidget>
      );
    }
    return node;
  }
}
