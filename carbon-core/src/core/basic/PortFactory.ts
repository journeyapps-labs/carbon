import { AttributePort, AttributePortOptions } from './AttributePort';

export interface PortTypeOptions {
  type: string;
  label: string;
}

export abstract class AbstractPortType {
  constructor(protected options: PortTypeOptions) {}

  abstract generatePort(type: string, options: AttributePortOptions): AttributePort;

  matches(type: string): boolean {
    return type === this.options.type;
  }

  get label() {
    return this.options.label;
  }

  generateTypes(): { key: string; label: string }[] {
    return [{ key: this.options.type, label: this.options.label }];
  }
}

export class PortFactory {
  types: Set<AbstractPortType>;

  constructor() {
    this.types = new Set<AbstractPortType>();
  }

  registerType(type: AbstractPortType) {
    this.types.add(type);
  }

  generatePort<P extends AttributePort>(type: string, options: AttributePortOptions): P {
    for (let portType of this.types) {
      if (portType.matches(type)) {
        return portType.generatePort(type, options) as P;
      }
    }
    throw new Error(`Could not generate attribute port for type ${type}`);
  }
}
