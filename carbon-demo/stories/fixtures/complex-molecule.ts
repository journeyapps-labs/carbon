import {
  AtomPortType,
  ForkAtom,
  JoinAtom,
  JoinAtomType,
  Molecule,
  ParamAtom,
  PortFactory,
  ProgramEndAtom,
  ProgramStartAtom,
  SimpleAtom
} from '@journeyapps-labs/carbon-core';
import { CarbonXmlSchemaParser } from '@journeyapps-labs/carbon-atom-builder';
import {
  NumericCondition,
  NumericConditionAtom,
  NumericConstantAtom,
  NumericPort,
  setupPortFactory,
  ValueType
} from '@journeyapps-labs/carbon-elements';
import { CustomCarbonRuntimeAtom, CustomCarbonRuntimeAtomSchema } from '@journeyapps-labs/carbon-atom-builder-runtime';

export class SimpleTestNumberAtom extends SimpleAtom {
  static NUMBER_IN = 'number-in';
  static NUMBER_OUT = 'number-out';

  constructor() {
    super({
      type: 'simple',
      cb: async () => {
        console.log('do nothing');
      }
    });
    this.addPort(
      new NumericPort({
        key: SimpleTestNumberAtom.NUMBER_IN,
        type: AtomPortType.IN
      })
    );
    this.addPort(
      new NumericPort({
        key: SimpleTestNumberAtom.NUMBER_OUT,
        type: AtomPortType.OUT
      })
    );
  }
}

export const createMolecule = () => {
  // new parser
  const schema = new CarbonXmlSchemaParser();

  const portFactory = new PortFactory();
  setupPortFactory(portFactory);

  // runtime atoms
  schema.registerAtomSchema(
    new CustomCarbonRuntimeAtomSchema({
      portFactory: portFactory,
      executeFunction: async ({ func }) => {
        console.log(`executing fn: ${func}`);
        return {};
      }
    })
  );

  const src = require('./schema.xml');
  const model = schema.parse(src);
  const factories = model.generateFactories();

  const molecule = new Molecule();

  // setup atoms
  const atom_start = new ProgramStartAtom();

  const atom_param1 = new ParamAtom({
    portFactory,
    defaultType: ValueType.TEXT,
    defaultName: 'param_1'
  });

  const atom_param2 = new ParamAtom({
    portFactory,
    defaultType: ValueType.TEXT,
    defaultName: 'param_2'
  });

  const atom_end = new ProgramEndAtom();
  const atom_fork = new ForkAtom();
  const atom_join = new JoinAtom({
    joinType: JoinAtomType.WAIT_ALL
  });
  const atom_value_1 = new NumericConstantAtom(10);
  const atom_value_2 = new NumericConstantAtom(20);
  const atom_value_3 = new NumericConstantAtom(30);
  const atom_simple_1 = new SimpleTestNumberAtom();
  const atom_simple_2 = new SimpleTestNumberAtom();
  const atom_simple_3 = new SimpleTestNumberAtom();
  const atom_numeric_cond = new NumericConditionAtom(NumericCondition.GREATER_THAN);
  const atom_join_2 = new JoinAtom({
    joinType: JoinAtomType.WAIT_ONE
  });
  const atom_custom = factories[0].generateAtom();

  /**
   * start -> fork -> atom_simple_1 -> join -> atom_simple_3 -> numeric condition -> join -> end
   *               -> atom_simple_2 ->                                            ->
   */
  atom_fork.getInPort(ForkAtom.PORT_IN).link(atom_start.getOutPort(ProgramStartAtom.PORT_START));
  atom_simple_1.getInPort(SimpleAtom.PORT_IN).link(atom_fork.getOutPort(ForkAtom.PORT_OUT_1));
  atom_simple_1.getInPort(SimpleTestNumberAtom.NUMBER_IN).link(atom_value_1.getOutPort(NumericConstantAtom.PORT));
  atom_simple_2.getInPort(SimpleAtom.PORT_IN).link(atom_fork.getOutPort(ForkAtom.PORT_OUT_2));
  atom_simple_2.getInPort(SimpleTestNumberAtom.NUMBER_IN).link(atom_value_2.getOutPort(NumericConstantAtom.PORT));
  atom_join.getInPort(JoinAtom.PORT_IN_1).link(atom_simple_1.getOutPort(SimpleAtom.PORT_OUT));
  atom_join.getInPort(JoinAtom.PORT_IN_2).link(atom_simple_2.getOutPort(SimpleAtom.PORT_OUT));
  atom_simple_3.getInPort(SimpleAtom.PORT_IN).link(atom_join.getOutPort(JoinAtom.PORT_OUT));
  atom_simple_3.getInPort(SimpleTestNumberAtom.NUMBER_IN).link(atom_value_3.getOutPort(NumericConstantAtom.PORT));

  atom_numeric_cond
    .getInPort(NumericConditionAtom.VALUE)
    .link(atom_simple_3.getOutPort(SimpleTestNumberAtom.NUMBER_OUT));
  atom_numeric_cond
    .getInPort(NumericConditionAtom.COMPARE_VALUE)
    .link(atom_value_3.getOutPort(NumericConstantAtom.PORT));
  atom_numeric_cond.getInPort(NumericConditionAtom.PORT_IN).link(atom_simple_3.getOutPort(SimpleAtom.PORT_OUT));
  atom_join_2.getInPort(JoinAtom.PORT_IN_1).link(atom_numeric_cond.getOutPort(NumericConditionAtom.PORT_TRUE));
  atom_join_2.getInPort(JoinAtom.PORT_IN_2).link(atom_numeric_cond.getOutPort(NumericConditionAtom.PORT_FALSE));

  atom_custom.getInPort(CustomCarbonRuntimeAtom.PORT_IN).link(atom_join_2.getOutPort(JoinAtom.PORT_OUT));

  atom_end.getInPort(ProgramEndAtom.PORT_END).link(atom_custom.getOutPort(CustomCarbonRuntimeAtom.PORT_OUT));

  // add in reverse order, so we can test the correct order
  molecule.addAtom(atom_start);
  molecule.addAtom(atom_param1);
  molecule.addAtom(atom_param2);
  molecule.addAtom(atom_end);
  molecule.addAtom(atom_fork);
  molecule.addAtom(atom_join);

  // purposefully add in reverse order
  molecule.addAtom(atom_simple_3);
  molecule.addAtom(atom_simple_2);
  molecule.addAtom(atom_simple_1);
  molecule.addAtom(atom_value_1);
  molecule.addAtom(atom_value_2);
  molecule.addAtom(atom_value_3);
  molecule.addAtom(atom_numeric_cond);
  molecule.addAtom(atom_join_2);
  molecule.addAtom(atom_custom);

  return {
    molecule,
    model
  };
};
