import { AtomPort, AtomPortType } from './AtomPort';
import { ExecutorAtom } from '../program/ExecutorAtom';
import { CarbonEntity } from '../CarbonEntity';
import { AbstractProperty } from '../properties/AbstractProperty';
import { PlaceholderPort } from './PlaceholderPort';
import { AttributePort } from './AttributePort';
import { BaseElement, BaseElementListener } from './BaseElement';
import { AtomFactory } from './AtomFactory';

export interface AtomListener extends BaseElementListener {
  portsUpdated: () => any;
  labelUpdated: () => any;
}

export interface AtomReplacePortsOptions<Port = AtomPort> {
  type: AtomPortType;
  deleteFilter: (port: Port) => boolean;
  ports: Port[];
}

export abstract class Atom<Properties extends { [key: string]: any } = {}>
  extends BaseElement<AtomListener>
  implements CarbonEntity
{
  ports: Map<string, AtomPort>;
  _label?: string;
  properties: Map<string, AbstractProperty>;

  constructor(type: string) {
    super(type);
    this.ports = new Map<string, AtomPort>();
    this.properties = new Map<string, AbstractProperty>();
  }

  dispose() {
    for (let prop of this.properties.values()) {
      prop.dispose();
    }
  }

  delete() {
    this.dispose();
    // clear all links
    this.getInPorts().forEach((p) => p.clear());
    this.getOutPorts().forEach((p) => p.clear());
    super.delete();
  }

  init(factory: AtomFactory) {
    super.init(factory);
    this.label = factory.label;
  }

  firePortsUpdated() {
    this.iterateListeners((cb) => cb.portsUpdated?.());
  }

  clearPorts() {
    this.ports.forEach((p) => {
      p.delete();
    });
  }

  clearProperties() {
    this.properties.forEach((p) => {
      p.dispose();
    });
    this.properties.clear();
  }

  getPropertyMap(): Properties {
    return Array.from(this.properties.values()).reduce((prev, cur) => {
      prev[cur.key] = cur.value;
      return prev;
    }, {}) as Properties;
  }

  setPropertyValue<K extends keyof Properties>(key: K, value: Properties[K]) {
    return this.properties.get(key as string).setValue(value);
  }

  getPropertyValue<K extends keyof Properties>(key: K): Properties[K] {
    return this.properties.get(key as string).value;
  }

  addProperty(property: AbstractProperty) {
    property.setAtom(this);
    this.properties.set(property.key, property);
    return property;
  }

  set label(label: string) {
    this._label = label;
    this.iterateListeners((cb) => cb.labelUpdated?.());
  }

  get label() {
    return this._label || this.type;
  }

  deletePort(key: string) {
    // if port was connected, replace with phantom port
    const port = this.ports.get(key);
    if (!port) {
      return;
    }
    this.ports.delete(key);
    this.firePortsUpdated();
  }

  addPort(port: AtomPort) {
    // check to see if we have a placeholder
    const existing = this.ports.get(port.key);
    if (existing) {
      // if this happens we want to re-link the port
      if (port instanceof AttributePort && existing instanceof PlaceholderPort) {
        if (port.type === AtomPortType.IN) {
          port.link(existing.linked);
          existing.clear();
          existing.delete();
        } else {
          let links = Array.from(existing.childrenPorts.values());
          links.forEach((l) => {
            l.clear();
            l.link(port);
          });
        }
      } else {
        throw new Error(`Node already has a port with key ${port.key}`);
      }
    }
    port.setAtom(this);
    let placeholderPort: PlaceholderPort = null;
    const l = port.registerListener({
      willDelete: () => {
        if (port instanceof AttributePort) {
          const linked = port.linked;
          const generatePort = () => {
            return new PlaceholderPort(port.valueType, {
              type: port.type,
              key: port.key,
              label: port.label,
              required: port.required
            });
          };

          // it an input and is linked
          if (port.type === AtomPortType.IN && linked) {
            placeholderPort = generatePort();
            placeholderPort.link(port.linked);
          }

          // it's an output and is linked
          else if (port.type === AtomPortType.OUT && port.childrenPorts.size > 0) {
            placeholderPort = generatePort();
            let links = Array.from(port.childrenPorts.values());
            links.forEach((l) => {
              l.clear();
              l.link(placeholderPort);
            });
          }
        }
      },
      deleted: () => {
        this.deletePort(port.key);
        l?.();

        if (placeholderPort) {
          // replace with placeholder port
          this.addPort(placeholderPort);
        }
      }
    });
    this.ports.set(port.key, port);
    return this;
  }

  getOutPort<T extends AtomPort>(port: string): T {
    const portObject = this.ports.get(port);
    if (portObject?.type === AtomPortType.OUT) {
      return portObject as T;
    }
    return null;
  }

  getInPort<T extends AtomPort>(port: string): T {
    const portObject = this.ports.get(port);
    if (portObject?.type === AtomPortType.IN) {
      return portObject as T;
    }
    return null;
  }

  replacePorts<P extends AtomPort>(options: AtomReplacePortsOptions<P>) {
    let dirty = false;
    this.fireWithoutEvents(async () => {
      const ports = this.getPorts(options.type).filter(options.deleteFilter);

      ports
        .filter((oldPort) => {
          return !options.ports.find((newPort) => newPort.equals(oldPort as P));
        })
        .forEach((p) => {
          p.delete();
          dirty = true;
        });

      options.ports
        .filter((newPort) => {
          return !ports.find((oldPort) => oldPort.equals(newPort));
        })
        .forEach((p) => {
          this.addPort(p);
          dirty = true;
        });
    });
    if (dirty) {
      this.firePortsUpdated();
    }
  }

  getPorts<T extends AtomPort>(type: AtomPortType): T[] {
    if (type === AtomPortType.IN) {
      return this.getInPorts();
    }
    return this.getOutPorts();
  }

  getOutPorts<T extends AtomPort>(): T[] {
    return Array.from(this.ports.values()).filter((port) => port.type === AtomPortType.OUT) as T[];
  }

  getInPorts<T extends AtomPort>(): T[] {
    return Array.from(this.ports.values()).filter((port) => port.type === AtomPortType.IN) as T[];
  }

  generateExecutorAtom(): ExecutorAtom {
    const executor = this._generateExecutorAtom();
    if (!executor) {
      return null;
    }
    return executor;
  }

  protected abstract _generateExecutorAtom(): ExecutorAtom;
}
