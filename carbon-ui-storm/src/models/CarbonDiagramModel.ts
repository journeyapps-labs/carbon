import { DiagramModel } from '@projectstorm/react-diagrams-core';
import { Atom, Molecule } from '@journeyapps-labs/carbon-core';
import { ThemedLink } from './ThemedLink';
import { BaseElementLayer } from '../element-layer/BaseElementLayer';
import { CarbonStormEngine } from '../CarbonStormEngine';
import { AtomNodeModel } from './atom/AtomNodeModel';

export class CarbonDiagramModel extends DiagramModel {
  annotationLayer: BaseElementLayer;

  constructor(
    public molecule: Molecule,
    engine: CarbonStormEngine
  ) {
    super();
    this.annotationLayer = new BaseElementLayer(engine);
    this.registerListener({
      linksUpdated: (event) => {
        const link = event.link as ThemedLink;
        const listener1 = link.observer.registerListener({
          linkWillDelete: () => {
            const port = link.getTargetPort();
            if (port) {
              (port.getNode() as AtomNodeModel).getAtomPort(port).clear();
            }
          }
        });

        const listener2 = link.registerListener({
          entityRemoved: () => {
            listener1.deregister();
            listener2.deregister();
          }
        });
      },
      nodesUpdated: (event) => {}
    });
    this.addLayer(this.annotationLayer);
  }

  dispose() {
    this.getAtomNodes().forEach((a) => {
      a.dispose();
    });
    this.getThemedLinks().forEach((l) => {
      l.dispose();
    });
  }

  getAtomNodes(): AtomNodeModel[] {
    return this.getNodes().filter((n) => n instanceof AtomNodeModel) as AtomNodeModel[];
  }

  getThemedLinks(): ThemedLink[] {
    return this.getLinks().filter((n) => n instanceof ThemedLink) as ThemedLink[];
  }

  getNodeForAtom(atom: Atom): AtomNodeModel {
    return this.getNodes().find((n) => {
      if (n instanceof AtomNodeModel) {
        return n.atom === atom;
      }
    }) as AtomNodeModel;
  }
}
