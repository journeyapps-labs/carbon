import { DefaultLinkModel, PointModel } from '@projectstorm/react-diagrams';
import { CarbonStormEngine } from '../CarbonStormEngine';
import { BaseListener, BaseObserver, ListenerHandle } from '@projectstorm/react-canvas-core';
import * as _ from 'lodash';
import { AtomPortType } from '@journeyapps-labs/carbon-core/dist/src';
import { AtomNodeModel } from './atom/AtomNodeModel';
import { PortModel } from '@projectstorm/react-diagrams-core';

export interface ThemedLinkListener extends BaseListener {
  linkWillDelete?: () => any;
}

export class ThemedLink extends DefaultLinkModel {
  themelistener: () => any;
  deleteListener: () => any;
  observer: BaseObserver<ThemedLinkListener>;
  pointListeners: Set<ListenerHandle>;

  constructor(
    protected engine: CarbonStormEngine,
    getColor: (engine: CarbonStormEngine) => string
  ) {
    super();
    this.setColor(getColor(engine));
    this.observer = new BaseObserver<ThemedLinkListener>();
    this.themelistener = engine.registerListener({
      themeChanged: () => {
        this.setColor(getColor(engine));
      }
    });
    this.deleteListener = this.registerListener({
      entityRemoved: () => {
        this.dispose();
      }
    }).deregister;
    this.pointListeners = new Set<ListenerHandle>();
  }

  updatePoints() {
    if (!this.getTargetPort()) {
      return;
    }
    const linkedModel = this.getTargetPort().getNode() as AtomNodeModel;
    const port = linkedModel.getAtomPort(this.getTargetPort());
    if (!port || port.type !== AtomPortType.IN) {
      return;
    }
    if (this.getPoints().length > 2) {
      port.points = _.slice([...this.getPoints()], 1, this.getPoints().length - 1).map((p) => {
        return {
          x: p.getX(),
          y: p.getY()
        };
      });
    } else {
      port.points = [];
    }
  }

  pointsChanged = _.debounce(() => {
    this.updatePoints();
  }, 100);

  removeMiddlePoints() {
    super.removeMiddlePoints();
    this.pointsChanged();
  }

  removePointsBefore(pointModel: PointModel) {
    super.removePointsBefore(pointModel);
    this.pointsChanged();
  }

  removePointsAfter(pointModel: PointModel) {
    super.removePointsAfter(pointModel);
    this.pointsChanged();
  }

  removePoint(pointModel: PointModel) {
    super.removePoint(pointModel);
    this.pointsChanged();
  }

  addPoint<P extends PointModel>(pointModel: P, index?: number): P {
    const p = super.addPoint(pointModel, index);
    let l = p.registerListener({
      entityRemoved: () => {
        this.pointListeners.delete(l);
        l?.deregister();
      },
      positionChanged: () => {
        this.pointsChanged();
      }
    });
    this.pointListeners.add(l);
    this.pointsChanged();
    return p;
  }

  remove() {
    this.observer.fireEvent({}, 'linkWillDelete');
    super.remove();
  }

  dispose() {
    this.themelistener();
    this.deleteListener();
    for (let l of this.pointListeners.values()) {
      l.deregister();
    }
  }
}
