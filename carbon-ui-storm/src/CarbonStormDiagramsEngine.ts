import {
  DefaultDiagramState,
  DiagramEngine,
  LinkLayerFactory,
  NodeLayerFactory
} from '@projectstorm/react-diagrams-core';
import { BaseModel, SelectionBoxLayerFactory, Toolkit } from '@projectstorm/react-canvas-core';
import { MouseEvent } from 'react';
import {
  DefaultLabelFactory,
  DefaultLinkFactory,
  DefaultNodeFactory,
  DefaultPortFactory
} from '@projectstorm/react-diagrams-defaults';
import { CarbonStormEngine } from './CarbonStormEngine';
import { BaseElementLayer, BaseElementLayerFactory } from './element-layer/BaseElementLayer';
import { AtomNodeWidgetFactory } from './models/atom/AtomNodeWidgetFactory';

export class CarbonStormDiagramsEngine extends DiagramEngine {
  constructor(public parentEngine: CarbonStormEngine) {
    super();

    this.getLayerFactories().registerFactory(new BaseElementLayerFactory(parentEngine));
    this.getNodeFactories().registerFactory(new AtomNodeWidgetFactory(parentEngine));

    this.getLayerFactories().registerFactory(new NodeLayerFactory());
    this.getLayerFactories().registerFactory(new LinkLayerFactory());
    this.getLayerFactories().registerFactory(new SelectionBoxLayerFactory());

    this.getLabelFactories().registerFactory(new DefaultLabelFactory());
    this.getNodeFactories().registerFactory(new DefaultNodeFactory());
    this.getLinkFactories().registerFactory(new DefaultLinkFactory());
    this.getPortFactories().registerFactory(new DefaultPortFactory());

    // register the default interaction behaviours
    this.getStateMachine().pushState(new DefaultDiagramState());
  }

  getAnnotationLayer() {
    return this.getModel()
      .getLayers()
      .find((l) => l.getType() === BaseElementLayerFactory.TYPE) as BaseElementLayer;
  }

  getMouseElement(event: MouseEvent): BaseModel {
    const model = super.getMouseElement(event);
    if (model) {
      return model;
    }
    const target = event.target as Element;
    const element = Toolkit.closest(target, '.annotation[data-annotationid]');
    if (element) {
      return this.getAnnotationLayer().getModel(element.getAttribute('data-annotationid'));
    }

    return null;
  }
}
