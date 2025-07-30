import {
  AttributePort,
  FlowPort,
  ForkAtom,
  JoinAtom,
  JoinAtomType,
  Molecule,
  OutputAtom,
  ParamAtom,
  PortFactory,
  ProgramEndAtom,
  ProgramStartAtom,
  SimpleAtom,
  SimpleValueAtom
} from '../../src';
import { SimpleTestNumberAtom } from '../SimpleTestNumberAtom';

export const createAtom = () => {
  // create a builder
  const molecule = new Molecule();

  // setup atoms
  const atom_start = new ProgramStartAtom();
  const atom_end = new ProgramEndAtom();
  const atom_fork = new ForkAtom();
  const atom_join = new JoinAtom({
    joinType: JoinAtomType.WAIT_ALL
  });
  const atom_value_2 = new SimpleValueAtom(20);
  const atom_value_3 = new SimpleValueAtom(30);
  const atom_simple_1 = new SimpleTestNumberAtom({
    sum: 1,
    wait: 15,
    message: 'fire second'
  });
  const atom_simple_2 = new SimpleTestNumberAtom({
    sum: 5,
    wait: 10,
    message: 'fire first'
  });
  const atom_simple_3 = new SimpleTestNumberAtom({
    sum: 13,
    wait: 5,
    message: 'fire third'
  });

  const portFactory = new PortFactory();
  portFactory.registerType({
    matches: () => {
      return true;
    },
    generatePort(type: string, options): AttributePort {
      return new AttributePort(type, options);
    },
    generateTypes: () => []
  } as any);

  const atom_param = new ParamAtom({
    defaultType: 'text',
    defaultName: 'param_1',
    portFactory
  });

  const atom_output = new OutputAtom({
    defaultType: 'text',
    defaultName: 'output_1',
    portFactory
  });

  /**
   * start -> fork -> atom_simple_1 -> join -> atom_simple_3 -> end
   *               -> atom_simple_2 ->
   */
  atom_fork.getInPort(ForkAtom.PORT_IN).link(atom_start.getOutPort(ProgramStartAtom.PORT_START));
  atom_simple_1.getInPort(SimpleTestNumberAtom.PORT_IN).link(atom_fork.getOutPort(ForkAtom.PORT_OUT_1));
  atom_simple_1.getInPort(SimpleTestNumberAtom.NUMBER_IN).link(atom_param.getOutPort(ParamAtom.PORT_VALUE));
  atom_simple_2.getInPort(SimpleAtom.PORT_IN).link(atom_fork.getOutPort(ForkAtom.PORT_OUT_2));
  atom_simple_2.getInPort(SimpleTestNumberAtom.NUMBER_IN).link(atom_value_2.getOutPort(SimpleValueAtom.PORT_OUT));
  atom_join.getInPort(JoinAtom.PORT_IN_1).link(atom_simple_1.getOutPort(SimpleTestNumberAtom.PORT_OUT));
  atom_join.getInPort(JoinAtom.PORT_IN_2).link(atom_simple_2.getOutPort(SimpleTestNumberAtom.PORT_OUT));
  atom_simple_3.getInPort(SimpleTestNumberAtom.PORT_IN).link(atom_join.getOutPort(JoinAtom.PORT_OUT));
  atom_simple_3.getInPort(SimpleTestNumberAtom.NUMBER_IN).link(atom_value_3.getOutPort(SimpleValueAtom.PORT_OUT));
  atom_end.getInPort(ProgramEndAtom.PORT_END).link(atom_simple_3.getOutPort(SimpleTestNumberAtom.PORT_OUT));
  atom_output.getInPort(OutputAtom.PORT_VALUE).link(atom_simple_3.getOutPort(SimpleTestNumberAtom.NUMBER_OUT));

  // add in reverse order, so we can test the correct order
  molecule.addAtom(atom_start);
  molecule.addAtom(atom_end);
  molecule.addAtom(atom_fork);
  molecule.addAtom(atom_join);

  // purposefully add in reverse order
  molecule.addAtom(atom_simple_3);
  molecule.addAtom(atom_simple_2);
  molecule.addAtom(atom_simple_1);
  molecule.addAtom(atom_param);
  molecule.addAtom(atom_output);
  molecule.addAtom(atom_value_2);
  molecule.addAtom(atom_value_3);

  return {
    molecule,
    atom_start,
    atom_end,
    atom_fork,
    atom_join,
    atom_simple_1,
    atom_simple_2,
    atom_simple_3,
    atom_param,
    atom_value_2,
    atom_value_3,
    atom_output
  };
};
