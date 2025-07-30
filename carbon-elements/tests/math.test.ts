import {
  AtomPortType,
  JoinAtom,
  JoinAtomType,
  Molecule,
  Program,
  ProgramEndAtom,
  ProgramStartAtom,
  SimpleAtom
} from '@journeyapps-labs/carbon-core';
import { NumericCondition, NumericConditionAtom } from '../src/math/NumericConditionAtom';
import { NumericConstantAtom } from '../src/constants/NumericConstantAtom';
import { Logger, LogLevel } from '@journeyapps-labs/carbon-utils';
import { ColourConsoleLoggerTransport } from '@journeyapps-labs/carbon-testing';
import { MathMaxAtom, NumericPort } from '../src';
import { describe, beforeEach, afterEach, it, expect } from 'vitest';

class NumberThroughAtom extends SimpleAtom {
  constructor() {
    super({
      type: 'number-through',
      cb: async ({ context }) => {
        const v = await context.getAttributeValue(this.getInPort('value-in'));
        context.outState.set(this.getOutPort('value-out'), v);
      }
    });
    this.addPort(
      new NumericPort({
        key: 'value-in',
        type: AtomPortType.IN
      })
    );
    this.addPort(
      new NumericPort({
        key: 'value-out',
        type: AtomPortType.OUT
      })
    );
  }
}

describe('Math test', () => {
  const jestConsole = console;

  beforeEach(() => {
    global.console = require('console');
  });

  afterEach(() => {
    global.console = jestConsole;
  });

  it('Should transform values', async () => {
    const molecule = new Molecule();
    const atom_start = new ProgramStartAtom();
    const atom_end = new ProgramEndAtom();
    const atom_constant_1 = new NumericConstantAtom(10);
    const atom_constant_2 = new NumericConstantAtom(20);

    const resultAtom = new NumberThroughAtom();
    const max_atom = new MathMaxAtom();

    /*
      start -------> NumberThroughAtom -> end
        10 -> max ->
        20 ->
     */

    max_atom.getInPorts()[0].link(atom_constant_1.getOutPorts()[0]);
    max_atom.getInPorts()[1].link(atom_constant_2.getOutPorts()[0]);
    resultAtom.getInPort('value-in').link(max_atom.getOutPorts()[0]);
    resultAtom.getInPort(SimpleAtom.PORT_IN).link(atom_start.getOutPorts()[0]);
    atom_end.getInPort(ProgramEndAtom.PORT_END).link(resultAtom.getOutPorts()[0]);

    molecule.addAtoms(atom_start, atom_end, max_atom, resultAtom, atom_constant_1, atom_constant_2);

    const program = new Program(molecule, {
      logger: new Logger({
        name: 'TRANSFORM_TEST',
        level: LogLevel.DEBUG,
        transport: new ColourConsoleLoggerTransport()
      })
    });
    program.compile();

    await program.run();
    expect(
      Array.from(program.executors.get(resultAtom).executingContexts.values())[0].outState.get(
        resultAtom.getOutPort('value-out')
      )
    ).toBe(20);
  });

  it('Should pass conditions', async () => {
    // create a builder
    const molecule = new Molecule();

    // setup flow

    const atom_start = new ProgramStartAtom();
    const atom_end = new ProgramEndAtom();
    const atom_constant_1 = new NumericConstantAtom(1);
    const atom_constant_2 = new NumericConstantAtom(2);
    const atom_numeric_condition = new NumericConditionAtom(NumericCondition.EQUALS);
    const atom_join = new JoinAtom({
      joinType: JoinAtomType.WAIT_ONE
    });
    const atom_simple_1 = new SimpleAtom({
      cb: async ({ context }) => {
        context.logger.info('Fire true');
      },
      type: 'simple-1'
    });
    const atom_simple_2 = new SimpleAtom({
      cb: async ({ context }) => {
        context.logger.info('Fire false');
      },
      type: 'simple-1'
    });

    /*

      start         -> numeric_condition
      constant_1[1] -> (value)    (true)  -> simple_atom -> join(wait_one) -> program-> end
      constant_2[2] -> (compare)  (false) -> simple_atom ->

     */

    atom_numeric_condition
      .getInPort(NumericConditionAtom.PORT_IN)
      .link(atom_start.getOutPort(ProgramStartAtom.PORT_START));
    atom_numeric_condition.getInPort(NumericConditionAtom.VALUE).link(atom_constant_1.port);
    atom_numeric_condition.getInPort(NumericConditionAtom.COMPARE_VALUE).link(atom_constant_2.port);
    atom_simple_1.getInPort(SimpleAtom.PORT_IN).link(atom_numeric_condition.getOutPort(NumericConditionAtom.PORT_TRUE));
    atom_simple_2
      .getInPort(SimpleAtom.PORT_IN)
      .link(atom_numeric_condition.getOutPort(NumericConditionAtom.PORT_FALSE));
    atom_join.getInPort(JoinAtom.PORT_IN_1).link(atom_simple_1.getOutPort(SimpleAtom.PORT_OUT));
    atom_join.getInPort(JoinAtom.PORT_IN_2).link(atom_simple_2.getOutPort(SimpleAtom.PORT_OUT));
    atom_end.getInPort(ProgramEndAtom.PORT_END).link(atom_join.getOutPort(JoinAtom.PORT_OUT));

    // add in reverse order, so we can test the correct order
    molecule.addAtom(atom_start);
    molecule.addAtom(atom_end);
    molecule.addAtom(atom_constant_1);
    molecule.addAtom(atom_constant_2);
    molecule.addAtom(atom_numeric_condition);
    molecule.addAtom(atom_join);
    molecule.addAtom(atom_simple_1);
    molecule.addAtom(atom_simple_2);

    const program = new Program(molecule, {
      logger: new Logger({
        name: 'PROGRAM',
        level: LogLevel.DEBUG,
        transport: new ColourConsoleLoggerTransport()
      })
    });
    program.compile();

    await program.run();
    expect(program.executors.get(atom_simple_2).executingContexts.size).toEqual(1);
  });
});
