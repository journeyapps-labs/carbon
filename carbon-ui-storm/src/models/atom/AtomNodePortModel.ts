import { DefaultPortModel, LinkModel } from '@projectstorm/react-diagrams';
import { BaseObserver } from '@journeyapps-labs/common-utils';
import { AtomPort, AtomPortType } from '@journeyapps-labs/carbon-core';
import { CarbonStormEngine } from '../../CarbonStormEngine';

export const generatePortName = (port: AtomPort) => {
  if (port.type === AtomPortType.IN) {
    return `in-${port.key}`;
  }
  return `out-${port.key}`;
};

export interface TypedPortModelListener {
  linkAdded: (link: LinkModel) => any;
  linkRemoved: (link: LinkModel) => any;
}

export class AtomNodePortModel<P extends AtomPort = AtomPort> extends DefaultPortModel {
  listener: BaseObserver<TypedPortModelListener>;

  constructor(
    type: string,
    protected port: P,
    protected engine: CarbonStormEngine
  ) {
    super({
      type: 'attribute',
      name: generatePortName(port),
      in: port.type === AtomPortType.IN
    });
    this.listener = new BaseObserver<TypedPortModelListener>();
  }

  addLink(link: LinkModel) {
    super.addLink(link);
    this.listener.iterateListeners((cb) => cb.linkAdded?.(link));
  }

  removeLink(link: LinkModel) {
    super.removeLink(link);
    this.listener.iterateListeners((cb) => cb.linkRemoved?.(link));
  }
}
