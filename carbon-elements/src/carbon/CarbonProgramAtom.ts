import {
  Atom,
  AtomFactory,
  AtomPortType,
  AttributePort,
  CompileEvent,
  CompileResultType,
  ExecutorAtom,
  ExecutorAtomContext,
  FlowPort,
  Invocation,
  Molecule,
  ParamAtom,
  PortFactory,
  Program
} from '@journeyapps-labs/carbon-core';
import { TypedPort } from '../types/TypedPort';

export interface CarbonProgramAtomFactoryOptions {
  portFactory: PortFactory;
}

export class CarbonProgramAtomFactory extends AtomFactory<CarbonProgramAtom> {
  static TYPE = 'carbon-molecule';

  constructor(protected options2: CarbonProgramAtomFactoryOptions) {
    super({
      type: CarbonProgramAtomFactory.TYPE,
      category: 'Advanced',
      label: 'Nested Carbon program'
    });
  }

  generateAtom(): CarbonProgramAtom {
    return new CarbonProgramAtom({
      molecule: null,
      label: 'nested program',
      portFactory: this.options2.portFactory
    });
  }
}

export class CarbonProgramExecutorContext extends ExecutorAtomContext<CarbonProgramExecutorAtom> {
  protected async _execute(): Promise<any> {
    const program = new Program(this.executor.atom.options.molecule, {
      logger: this.logger
    });
    const inputs = this.executor.atom
      .getInPorts<AttributePort<CarbonProgramAtomPortMeta>>()
      .filter((p) => p.metadata.molecule);
    let vals = {};
    for (let param of inputs) {
      vals[param.key] = await this.getAttributeValue(param);
    }
    await program.run(vals);
  }
}

export class CarbonProgramExecutorAtom extends ExecutorAtom<ExecutorAtomContext, CarbonProgramAtom> {
  compile(event: CompileEvent) {
    super.compile(event);
    if (!this.atom.options.molecule) {
      event.pushResult({
        entity: this.atom,
        message: 'Node is missing a valid molecule',
        type: CompileResultType.ERROR
      });
    }
  }

  protected doInvoke(invoke: Invocation) {
    this.addContext(invoke, new CarbonProgramExecutorContext()).execute();
  }
}

export interface CarbonProgramAtomOptions {
  molecule: Molecule;
  label: string;
  portFactory: PortFactory;
}

export interface CarbonProgramAtomPortMeta {
  molecule: boolean;
}

export class CarbonProgramAtom extends Atom {
  static FLOW_IN = 'flow-in';
  static FLOW_OUT = 'flow-out';

  constructor(public options: CarbonProgramAtomOptions) {
    super(CarbonProgramAtomFactory.TYPE);
    if (options.molecule) {
      this.setNestedMolecule(options.molecule);
    }
    this.addPort(
      new FlowPort({
        key: CarbonProgramAtom.FLOW_IN,
        type: AtomPortType.IN
      })
    );
    this.addPort(
      new FlowPort({
        key: CarbonProgramAtom.FLOW_OUT,
        type: AtomPortType.OUT
      })
    );
  }

  setNestedMolecule(molecule: Molecule) {
    // remove previous ports
    Array.from(this.ports.values()).forEach((p: AttributePort<CarbonProgramAtomPortMeta>) => {
      if (p.metadata.molecule) {
        p.delete();
      }
    });
    molecule.getParamNodes().forEach((paramNode) => {
      const port = paramNode.getOutPort<TypedPort>(ParamAtom.PORT_VALUE);
      const generatedPort = this.options.portFactory.generatePort<AttributePort<CarbonProgramAtomPortMeta>>(port.type, {
        type: AtomPortType.IN,
        key: paramNode.paramName,
        label: paramNode.label
      });
      generatedPort.putMetadata({
        molecule: true
      });
      this.addPort(generatedPort);
    });
  }

  protected _generateExecutorAtom(): ExecutorAtom {
    return new CarbonProgramExecutorAtom(this);
  }
}
