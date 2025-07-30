import * as React from 'react';
import { NodeModel, PortModel } from '@projectstorm/react-diagrams-core';
import { Atom, AtomPort, AtomPortType, AttributePort, FlowPort, PlaceholderPort } from '@journeyapps-labs/carbon-core';
import { DefaultPortModel } from '@projectstorm/react-diagrams';
import { TypedPortModel } from './TypedPortModel';
import { FlowPortModel } from '../FlowPortModel';
import { CarbonStormEngine } from '../../CarbonStormEngine';
import * as _ from 'lodash';
import { CarbonDiagramModel } from '../CarbonDiagramModel';
import { AtomNodePortModel, generatePortName } from './AtomNodePortModel';
import { ThemedLink } from '../ThemedLink';
import { setupStormModel } from '../element/BaseElementStormModel';
import { AtomNodeWidgetFactory } from './AtomNodeWidgetFactory';

export class AtomNodeModel<A extends Atom = Atom> extends setupStormModel(NodeModel) {
  private l3: () => any;

  constructor(
    public atom: A,
    protected engine: CarbonStormEngine
  ) {
    super({
      type: AtomNodeWidgetFactory.TYPE
    });
    this.setElement(atom);
    this.generatePorts();
    this.l3 = atom.registerListener({
      portsUpdated: () => {
        this.updatePorts();
      }
    });
  }

  updatePorts = _.debounce(() => {
    _.values(this.getPorts()).forEach((p) => {
      // remove the port from the node, this will auto detach the links (but not remove them)
      this.removePort(p);
    });

    // generate new ports
    this.generatePorts();

    if (this.engine) {
      // re-attach all the links
      this.atom.getInPorts().forEach((p) => {
        this.setupPortLinks(p, this.engine.getModel());
      });
      this.atom.getOutPorts().forEach((p) => {
        this.setupPortLinks(p, this.engine.getModel());
      });
    }
  }, 10);

  dispose() {
    super.dispose();
    this.l3?.();
  }

  setupPortLinks(port: AtomPort, model: CarbonDiagramModel) {
    if (port.type === AtomPortType.IN) {
      if (!port.linked) {
        return;
      }
      const linkedAtom = model.getNodeForAtom(port.linked.atom);
      if (!linkedAtom) {
        console.warn('no linked atom');
        return;
      }
      const outPort = linkedAtom.getNodePort(port.linked);

      const looseLink = _.find(outPort.getLinks(), (link) => !link.getTargetPort());
      // use existing link
      if (looseLink) {
        looseLink.setTargetPort(this.getNodePort(port));
      } else {
        const link = outPort.link(this.getNodePort(port));
        port.points.forEach((p, index) => {
          link.addPoint(link.generatePoint(p.x, p.y), index + 1);
        });
        model.addLink(link);
      }
    } else {
      const reconstructLink = (port: AtomPort) => {
        const linkedPort = model.getNodeForAtom(port.atom).getNodePort(port);
        const link = _.values(linkedPort.getLinks())[0];
        if (link) {
          link.setSourcePort(this.getNodePort(port.linked));
        }
      };

      if (port instanceof AttributePort) {
        port.childrenPorts.forEach((p) => {
          reconstructLink(p);
        });
      } else if (port.linked) {
        reconstructLink(port.linked);
      }
    }
  }

  getNodePort(port: AtomPort) {
    return this.getPort(generatePortName(port)) as DefaultPortModel;
  }

  getAtomPort(port: PortModel) {
    if (!port) {
      return null;
    }
    if (port.getName().substring(0, 3) == 'in-') {
      return this.atom.getInPort(port.getName().substring(3));
    }
    return this.atom.getOutPort(port.getName().substring(4));
  }

  generatePorts() {
    for (let port of this.atom.getInPorts()) {
      this.addPort(this.generatePort(port));
    }

    for (let port of this.atom.getOutPorts()) {
      this.addPort(this.generatePort(port));
    }
  }

  protected _generatePort(port: AtomPort): AtomNodePortModel {
    if (port instanceof PlaceholderPort) {
      return new AtomNodePortModel('placeholder', port, this.engine);
    }
    if (port instanceof AttributePort) {
      return new TypedPortModel(port, this.engine);
    }
    if (port instanceof FlowPort) {
      return new FlowPortModel(port, this.engine);
    }
    throw new Error('Unsupported port type');
  }

  generatePort(port: AtomPort) {
    const portModel = this._generatePort(port);

    // todo only register this after the initial creation
    const l1 = portModel.listener.registerListener({
      linkAdded: (link: ThemedLink) => {
        // links were created the wrong way around
        if (port.type === AtomPortType.OUT) {
          if ((link.getSourcePort() as DefaultPortModel)?.getOptions().in) {
            const source = link.getSourcePort();
            _.defer(() => {
              // intercept the link being deleted event to prevent the atoms ports from being cleared in
              // the CarbonDiagramModel (race condition)
              const ob = link.observer.registerListener({
                eventWillFire: (event) => {
                  if (event.function === 'linkWillDelete') {
                    event.stopPropagation();
                    ob.deregister();
                  }
                },
                linkWillDelete: () => {}
              });
              link.remove();
            });
            this.engine.getModel().addLink(portModel.link(source));
            const node = source.getNode() as AtomNodeModel;
            node.getAtomPort(source).link(port);
            return;
          }
        }

        // there is already a link
        if (_.values(portModel.getLinks()).length > 1) {
          return;
        }

        const sourceNode = link.getSourcePort()?.getNode() as AtomNodeModel;
        if (!sourceNode) {
          return;
        }
        try {
          port.link(sourceNode.getAtomPort(link.getSourcePort()));
        } catch (ex) {}
      }
    });
    const l2 = portModel.registerListener({
      entityRemoved: () => {
        l1();
        l2.deregister();
      }
    });
    return portModel;
  }
}
