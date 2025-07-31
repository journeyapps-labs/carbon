import {
  AbstractProperty,
  Atom,
  AtomPortType,
  AttributePort,
  AttributePortOptions,
  ExecutorAtom,
  ExecutorAtomContext,
  FlowPort,
  Invocation,
  MapProperty
} from '@journeyapps-labs/carbon-core';
import { CustomCarbonAtomModel } from './CustomCarbonAtomModel';
import { CustomCarbonAtomModelParam, CustomCarbonAtomModelProperty } from '@journeyapps-labs/carbon-atom-builder';

export class CustomCarbonRuntimeExecutorContext extends ExecutorAtomContext<CustomCarbonRuntimeAtomExecutor> {
  protected async _execute(): Promise<any> {
    const fn = this.executor.atom.model.fn;
    const finalAttributes = await this.getAttributeValues();

    this.logger.debug(`Executing view fn: ${fn}`);
    const res = await this.executor.atom.model.schema.options.executeFunction({
      func: fn,
      inputs: finalAttributes,
      properties: this.executor.atom.getPropertyMap()
    });

    // gather outputs
    this.executor.atom
      .getOutPorts()
      .filter((p) => p instanceof AttributePort)
      .forEach((f: AttributePort) => {
        if (res?.[f.key] != null) {
          this.outState.set(f, res?.[f.key]);
        }
      });

    this.activateFlowPort(this.executor.atom.getOutPort(CustomCarbonRuntimeAtom.PORT_OUT));
  }
}

export class CustomCarbonRuntimeAtomExecutor extends ExecutorAtom<
  CustomCarbonRuntimeExecutorContext,
  CustomCarbonRuntimeAtom
> {
  protected doInvoke(invoke: Invocation) {
    super.doInvoke(invoke);
    this.addContext(invoke, new CustomCarbonRuntimeExecutorContext()).execute();
  }
}

export interface CustomCarbonRuntimeAtomOptions {
  model: CustomCarbonAtomModel;
}

export class CustomCarbonRuntimeAtom extends Atom<any> {
  static PORT_IN = 'in';
  static PORT_OUT = 'out';

  constructor(protected options: CustomCarbonRuntimeAtomOptions) {
    super(options.model.options.key);
    this.addPort(
      new FlowPort({
        key: CustomCarbonRuntimeAtom.PORT_IN,
        type: AtomPortType.IN
      })
    );
    this.addPort(
      new FlowPort({
        key: CustomCarbonRuntimeAtom.PORT_OUT,
        type: AtomPortType.OUT
      })
    );

    this.model = options.model;
  }

  get model() {
    return this.options.model;
  }

  set model(model: CustomCarbonAtomModel) {
    this.options.model = model;
    this.label = model.options.label;
    this.getInPorts()
      .filter((p) => p.key !== CustomCarbonRuntimeAtom.PORT_IN)
      .forEach((p) => p.delete());
    this.getOutPorts()
      .filter((p) => p.key !== CustomCarbonRuntimeAtom.PORT_OUT)
      .forEach((p) => p.delete());

    for (let input of model.inputs) {
      this.addPort(this.generateAttribute(AtomPortType.IN, input));
    }

    for (let output of model.outputs) {
      this.addPort(this.generateAttribute(AtomPortType.OUT, output));
    }

    // update properties
    const propertyValues = this.getPropertyMap();
    this.clearProperties();
    for (let property of model.properties) {
      const propertyObject = this.generateProperty(property, propertyValues[property.name]);
      if (propertyObject) {
        this.addProperty(propertyObject);
      }
    }
  }

  generateProperty(property: CustomCarbonAtomModelProperty, value: any): AbstractProperty {
    if (property.type === MapProperty.TYPE) {
      return new MapProperty({
        key: property.name,
        label: property.label,
        description: property.description,
        value: value ?? {}
      });
    }
    return null;
  }

  generateAttribute(type: AtomPortType, param: CustomCarbonAtomModelParam) {
    let params: AttributePortOptions = {
      key: param.name,
      label: param.label,
      required: param.required ?? true,
      type
    };
    return this.model.schema.options.portFactory.generatePort(param.type, params);
  }

  protected _generateExecutorAtom(): CustomCarbonRuntimeAtomExecutor {
    return new CustomCarbonRuntimeAtomExecutor(this);
  }
}
