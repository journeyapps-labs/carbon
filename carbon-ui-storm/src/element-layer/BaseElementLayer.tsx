import * as React from 'react';
import {
  AbstractModelFactory,
  AbstractReactFactory,
  FactoryBank,
  GenerateModelEvent,
  GenerateWidgetEvent,
  LayerModel,
  LayerModelGenerics
} from '@projectstorm/react-canvas-core';
import { CarbonStormEngine } from '../CarbonStormEngine';
import * as _ from 'lodash';
import { AnnotationElement } from '@journeyapps-labs/carbon-core';
import { CarbonThemeContainerWidget } from '../CarbonThemeContainerWidget';
import { AnnotationElementStormFactory } from './TextAnnotationElementFactory';

export const BaseElementLayerWidget: React.FC<{
  event: GenerateWidgetEvent<BaseElementLayer>;
  engine: CarbonStormEngine;
}> = ({ event, engine }) => {
  return (
    <CarbonThemeContainerWidget engine={engine}>
      {_.map(event.model.getModels(), (m) => {
        return (
          <React.Fragment key={m.getID()}>
            {event.model
              .getChildModelFactoryBank(engine.diagramEngine)
              .getFactory<BaseElementLayerFactory>(m.getType())
              .generateReactWidget({
                model: m as any
              })}
          </React.Fragment>
        );
      })}
    </CarbonThemeContainerWidget>
  );
};

export class BaseElementLayerFactory extends AbstractReactFactory<BaseElementLayer> {
  static TYPE = 'base-element-layer';

  constructor(protected engine2: CarbonStormEngine) {
    super(BaseElementLayerFactory.TYPE);
  }

  generateModel(event: GenerateModelEvent): BaseElementLayer {
    return new BaseElementLayer(this.engine2);
  }

  generateReactWidget(event: GenerateWidgetEvent<BaseElementLayer>): React.JSX.Element {
    return <BaseElementLayerWidget engine={this.engine2} event={event} />;
  }
}

export class BaseElementLayer extends LayerModel {
  bank: FactoryBank<AbstractReactFactory>;

  constructor(protected engine: CarbonStormEngine) {
    super({
      isSvg: false,
      transformed: true,
      type: BaseElementLayerFactory.TYPE
    });
    this.bank = new FactoryBank();
    this.bank.registerFactory(new AnnotationElementStormFactory(engine));
  }

  addAnnotation(annotation: AnnotationElement) {
    const model = this.bank.getFactory(annotation.type).generateModel({ initialConfig: { annotation } });
    // TODO this should be fixed in React Diagrams
    let listener = model.registerListener({
      entityRemoved: () => {
        this.removeModel(model);
        listener?.deregister();
        listener = null;
        this.engine.diagramEngine.repaintCanvas();
      }
    });
    this.addModel(model);
  }

  getChildModelFactoryBank(engine: LayerModelGenerics['ENGINE']): FactoryBank<AbstractModelFactory> {
    return this.bank;
  }
}
