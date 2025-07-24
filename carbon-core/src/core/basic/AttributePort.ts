import { AtomPort, AtomPortType, CarbonPortOptions } from './AtomPort';
import { CompileEvent, CompileResultType } from '../program/CompileInterface';

export interface AttributePortOptions extends CarbonPortOptions {
  /**
   * Defaults to TRUE
   */
  required?: boolean;
}

export class AttributePort<Meta extends {} = {}> extends AtomPort<AttributePortOptions, AttributePort, Meta> {
  childrenPorts: Set<AttributePort>;

  constructor(
    public valueType: string,
    options: AttributePortOptions
  ) {
    super(options);
    this.childrenPorts = new Set<AttributePort>();
  }

  get required() {
    return this.options.required ?? true;
  }

  link(port: AttributePort) {
    super.link(port);
    port.childrenPorts.add(this);
    port.iterateListeners((cb) => cb.linkUpdated?.());
  }

  clear() {
    if (this.type === AtomPortType.IN) {
      this.linked?.childrenPorts.delete(this);
    } else {
      for (let port of Array.from(this.childrenPorts.values())) {
        port.clear();
      }
    }
    super.clear();
  }

  compile(event: CompileEvent) {
    super.compile(event);
    if (this.required && !this.linked && this.options.type === AtomPortType.IN) {
      event.pushResult({
        message: `Input attribute port '${this.label}' is missing a connection.`,
        type: CompileResultType.ERROR,
        entity: this
      });
    } else if (this.childrenPorts.size === 0 && this.options.type === AtomPortType.OUT) {
      event.pushResult({
        message: `Unused out port '${this.label}' on node '${this.atom.label}'`,
        type: CompileResultType.INFO,
        entity: this
      });
    }
  }

  connected(): boolean {
    return this.type === AtomPortType.OUT ? this.childrenPorts.size > 0 : !!this.linked;
  }

  protected getComparePayload() {
    return {
      ...super.getComparePayload(),
      valueType: this.valueType
    };
  }
}
