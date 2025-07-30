import * as _ from 'lodash';
import { Atom } from '../../core/basic/Atom';
import { AtomPort, AtomPortType, CarbonPortOptions } from '../../core/basic/AtomPort';
import { EnumProperty } from '../../core/properties/EnumProperty';
import { PortFactory } from '../../core/basic/PortFactory';
import { TextProperty } from '../../core/properties/TextProperty';
import { AttributePort } from '../../core/basic/AttributePort';

export interface BaseParamAtomOptions {
  portFactory: PortFactory;
  defaultType: string;
  defaultName?: string;
}

export enum ParamAtomProperty {
  TYPE = 'type',
  NAME = 'name'
}

export interface ParamAtomProperties {
  [ParamAtomProperty.TYPE]: string;
  [ParamAtomProperty.NAME]: string;
}

export abstract class BaseParamAtom extends Atom<ParamAtomProperties> {
  constructor(
    type: string,
    protected options: BaseParamAtomOptions,
    protected portType: AtomPortType
  ) {
    super(type);
    this.addProperty(
      new EnumProperty<string>({
        value: options.defaultType,
        values: _.flatMap(Array.from(options.portFactory.types.values(), (type) => type.generateTypes())),
        label: 'Type',
        key: ParamAtomProperty.TYPE
      })
    ).registerListener({
      propertyChanged: () => {
        this.regeneratePort();
      }
    });
    this.addProperty(
      new TextProperty({
        value: options.defaultName,
        label: 'Name',
        key: ParamAtomProperty.NAME
      })
    ).registerListener({
      propertyChanged: () => {
        this.regenerateLabel();
      }
    });

    this.regenerateLabel();
    this.regeneratePort();
  }

  get paramName() {
    return this.getPropertyValue(ParamAtomProperty.NAME);
  }

  set paramName(name: string) {
    this.setPropertyValue(ParamAtomProperty.NAME, name);
  }

  get paramType() {
    return this.getPropertyValue(ParamAtomProperty.TYPE);
  }

  set paramType(type: string) {
    this.setPropertyValue(ParamAtomProperty.TYPE, type);
  }

  regenerateLabel() {
    this.label = this.paramName;
  }

  protected abstract _regeneratePort(): AttributePort<{ param: boolean }>;

  regeneratePort() {
    const port = this._regeneratePort();
    port.metadata.param = true;
    this.replacePorts({
      type: this.portType,
      deleteFilter: (p) => {
        return !!p.metadata.param;
      },
      ports: [port]
    });
  }
}
