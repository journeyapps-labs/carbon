import * as React from 'react';
import { useEffect } from 'react';
import {
  AbstractModelFactory,
  AbstractReactFactory,
  BaseEntityEvent,
  CanvasEngine,
  FactoryBank,
  GenerateModelEvent,
  GenerateWidgetEvent,
  LayerModel,
  LayerModelGenerics,
  ListenerHandle
} from '@projectstorm/react-canvas-core';
import { CarbonStormEngine } from '../CarbonStormEngine';
import { NodeModel, PortModel } from '@projectstorm/react-diagrams-core';
import * as _ from 'lodash';
import { PortLabelFactory, PortLabelModel } from './PortLabelModel';
import { AttributePort } from '@journeyapps-labs/carbon-core';
import { AtomNodeModel } from '../models/atom/AtomNodeModel';

export const CarbonPortLayerWidget: React.FC<{
  event: GenerateWidgetEvent<CarbonPortTypeLayer>;
  engine: CanvasEngine;
}> = ({ event, engine }) => {
  useEffect(() => {
    return () => {
      event.model.dispose();
    };
  }, []);
  return (
    <>
      {_.map(event.model.getModels(), (m) => {
        return (
          <React.Fragment key={m.getID()}>
            {event.model
              .getChildModelFactoryBank(engine)
              .getFactory<PortLabelFactory>(m.getType())
              .generateReactWidget({
                model: m as any
              })}
          </React.Fragment>
        );
      })}
    </>
  );
};

export abstract class CarbonPortTypeLayerFactory extends AbstractReactFactory<CarbonPortTypeLayer> {
  static TYPE = 'port-type-layer';

  constructor(protected engine2: CarbonStormEngine) {
    super(CarbonPortTypeLayerFactory.TYPE);
  }

  abstract generatePortLabel(port: AttributePort, port2: PortModel): null | PortLabelModel;

  generateModel(event: GenerateModelEvent): CarbonPortTypeLayer {
    return new CarbonPortTypeLayer(this.engine2, this);
  }

  generateReactWidget(event: GenerateWidgetEvent<CarbonPortTypeLayer>): React.JSX.Element {
    return <CarbonPortLayerWidget engine={this.engine} event={event} />;
  }
}

export class CarbonPortTypeLayer extends LayerModel<LayerModelGenerics & { CHILDREN: PortLabelModel }> {
  bank: FactoryBank<AbstractReactFactory>;
  listener: ListenerHandle;
  atomsSetup: Map<AtomNodeModel, () => any>;

  constructor(
    protected engine: CarbonStormEngine,
    protected factory: CarbonPortTypeLayerFactory
  ) {
    super({
      isSvg: false,
      transformed: true,
      type: CarbonPortTypeLayerFactory.TYPE
    });
    this.atomsSetup = new Map<AtomNodeModel, () => any>();
    this.bank = new FactoryBank();
    engine.diagramEngine.registerFactoryBank(this.bank);
    this.bank.registerFactory(new PortLabelFactory());
    engine.registerListener({
      modelChanged: () => {
        for (let node of engine.getModel().getNodes()) {
          this.setupListener(node);
        }
        this.listener?.deregister();
        this.listener = engine.getModel().registerListener({
          nodesUpdated: (event: BaseEntityEvent & { node: NodeModel }) => {
            this.updateLabels();
            this.setupListener(event.node);
          }
        });
        this.updateLabels();
      }
    });
    this.updateLabels();
  }

  setupListener(atom: NodeModel) {
    if (!(atom instanceof AtomNodeModel)) {
      return;
    }
    if (this.atomsSetup.has(atom)) {
      return;
    }
    let deregister: () => any = null;
    const listener1 = atom.atom.registerListener({
      portsUpdated: () => {
        this.updateLabels();
      }
    });
    const listener2 = atom.registerListener({
      entityRemoved(event: BaseEntityEvent) {
        deregister();
      }
    });
    deregister = () => {
      listener1();
      listener2.deregister();
      this.atomsSetup.delete(atom);
    };
    this.atomsSetup.set(atom, deregister);
  }

  dispose() {
    this.listener?.deregister();
    for (let a of this.atomsSetup.values()) {
      a();
    }
  }

  getAllCarbonPorts(): AttributePort[] {
    return _.chain(this.engine.getModel().getNodes())
      .filter((a) => a instanceof AtomNodeModel)
      .flatMap((a: AtomNodeModel) => {
        return a.atom.getInPorts().concat(a.atom.getOutPorts());
      })
      .filter((p) => p instanceof AttributePort)
      .value() as AttributePort[];
  }

  updateLabels = _.debounce(() => {
    _.values(this.getModels()).forEach((m) => {
      this.removeModel(m);
    });

    _.values(this.getAllCarbonPorts())
      .map((port) => {
        return this.factory.generatePortLabel(port, this.engine.getModel().getNodeForAtom(port.atom).getNodePort(port));
      })
      .filter((m) => !!m)
      .forEach((m) => {
        this.addModel(m);
      });
    this.engine.diagramEngine.repaintCanvas();
  }, 20);

  getChildModelFactoryBank(engine: LayerModelGenerics['ENGINE']): FactoryBank<AbstractModelFactory> {
    return this.bank;
  }
}
