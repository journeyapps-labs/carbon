import { Molecule } from '../src/core/basic/Molecule';
import { ProgramEndAtom } from '../src/elements/ProgramEndAtom';
import { ExecutorAtomContext, Program } from '../src';
import { SimpleTestNumberAtom } from './SimpleTestNumberAtom';
import { Logger, LogLevel } from '@journeyapps-labs/carbon-utils';
import { ColourConsoleLoggerTransport } from '@journeyapps-labs/carbon-testing';
import { describe, beforeEach, afterEach, it, expect } from 'vitest';

import { createAtom } from './fixtures/createAtom';

describe('Core tests', () => {
  const jestConsole = console;

  beforeEach(() => {
    global.console = require('console');
  });

  afterEach(() => {
    global.console = jestConsole;
  });

  it('should complain about a node not being connected', async () => {
    const molecule = new Molecule();
    const atom_value_1 = new ProgramEndAtom();
    molecule.addAtom(atom_value_1);
    const program = new Program(molecule);
    await expect(() => program.compile()).toThrowError();
  });

  it('should run in parallel a program', async () => {
    // create a builder
    const { molecule, atom_simple_1, atom_simple_2, atom_simple_3 } = createAtom();

    // create and execute a program
    const program = new Program(molecule, {
      logger: new Logger({
        name: 'PROGRAM',
        level: LogLevel.INFO,
        transport: new ColourConsoleLoggerTransport()
      })
    });

    program.compile();

    let order: ExecutorAtomContext[] = [];
    program.executors.forEach((f) => {
      f.registerListener({
        contextGenerated: ({ context }) => {
          context.registerListener({
            completed: () => {
              if (context.executor.atom instanceof SimpleTestNumberAtom) {
                order.push(context);
              }
            }
          });
        }
      });
    });

    const res = await program.run({
      param_1: 10
    });

    expect(res.params['output_1']).toEqual(43);

    // the order here is important
    expect(order[0].executor.atom).toBe(atom_simple_2);
    expect(order[1].executor.atom).toBe(atom_simple_1);
    expect(order[2].executor.atom).toBe(atom_simple_3);

    // the values here are important
    expect(order[0].outState.get(atom_simple_2.getOutPort(SimpleTestNumberAtom.NUMBER_OUT))).toEqual(25);
    expect(order[1].outState.get(atom_simple_1.getOutPort(SimpleTestNumberAtom.NUMBER_OUT))).toEqual(11);
    expect(order[2].outState.get(atom_simple_3.getOutPort(SimpleTestNumberAtom.NUMBER_OUT))).toEqual(43);

    // test params
  });
});
