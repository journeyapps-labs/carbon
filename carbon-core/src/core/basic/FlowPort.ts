import { AtomPort, CarbonPortOptions, Point } from './AtomPort';
import { CompileEvent, CompileResultType } from '../program/CompileInterface';

export class FlowPort extends AtomPort<CarbonPortOptions, FlowPort> {
  linked: FlowPort;

  constructor(options: CarbonPortOptions) {
    super(options);
    this.linked = null;
  }

  link(port: FlowPort) {
    this.linked = port;
    port.linked = this;
    port.iterateListeners((cb) => cb.linkUpdated?.());
  }

  compile(event: CompileEvent) {
    super.compile(event);
    if (!this.linked) {
      event.pushResult({
        entity: this,
        type: CompileResultType.ERROR,
        message: `Flow port '${this.label}' on '${this.atom.label}' is not connected to a parent node.`
      });
    }
  }

  connected(): boolean {
    return !!this.linked;
  }
}
