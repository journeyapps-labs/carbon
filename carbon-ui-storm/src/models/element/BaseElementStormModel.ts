import { BasePositionModel } from '@projectstorm/react-canvas-core';
import '@projectstorm/geometry';
import { BaseElement } from '@journeyapps-labs/carbon-core';

type GConstructor<T = {}> = new (...args: any[]) => T;

export type BaseElementStormModelInterface<E> = {
  element: E;
  setElement(element: E);

  dispose();
};

export const setupStormModel = <T extends BasePositionModel, E extends BaseElement>(
  SuperClass: GConstructor<T>
): GConstructor<T & BaseElementStormModelInterface<E>> => {
  // @ts-ignore
  class BaseElementStormModel extends SuperClass implements BaseElementStormModelInterface {
    element: E;

    disposeListeners: () => any;
    private l1;
    private l2;

    setElement(element: E) {
      this.element = element;
      this.setPosition(element.x, element.y);

      // listen to element being deleted
      this.l1 = element.registerListener({
        deleted: () => {
          this.dispose();
          this.remove();
        }
      });

      // listen to this deleting
      this.l2 = this.registerListener({
        entityRemoved: () => {
          element.delete();
        }
      }).deregister;
    }

    setPosition(x, y?): any {
      super.setPosition(x, y);
      this.element.x = this.getX();
      this.element.y = this.getY();
    }

    dispose() {
      this.l1();
      this.l2();
    }
  }

  return BaseElementStormModel as any;
};
