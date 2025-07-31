import { CarbonXmlSchemaParser } from '@journeyapps-labs/carbon-atom-builder';
import { CustomCarbonRuntimeAtomSchema } from '../src/CustomCarbonRuntimeAtomSchema';
import * as fs from 'fs/promises';
import * as path from 'path';
import {
  FlowPort,
  Molecule,
  PortFactory,
  Program,
  ProgramEndAtom,
  ProgramStartAtom
} from '@journeyapps-labs/carbon-core';
import { CustomCarbonAtomFactory } from '../src/CustomCarbonAtomFactory';
import { Logger, LogLevel } from '@journeyapps-labs/carbon-utils';
import { ColourConsoleLoggerTransport } from '@journeyapps-labs/carbon-testing';
import { CustomCarbonRuntimeAtom } from '../src/CustomCarbonRuntimeAtom';
import { describe, beforeEach, afterEach, it, expect } from 'vitest';

describe('build test', () => {
  const jestConsole = console;

  beforeEach(() => {
    global.console = require('console');
  });

  afterEach(() => {
    global.console = jestConsole;
  });

  it('should create a program with custom nodes', async () => {
    // new parser
    const schema = new CarbonXmlSchemaParser();

    const factory = new PortFactory();

    // runtime atoms
    schema.registerAtomSchema(
      new CustomCarbonRuntimeAtomSchema({
        portFactory: factory,
        executeFunction: async ({ func }) => {
          return {};
        }
      })
    );

    const src = await fs.readFile(path.join(__dirname, './fixtures/schema.xml'), {
      encoding: 'utf-8'
    });
    const model = schema.parse(src);
    const factories = model.generateFactories();

    // check that we parsed one
    expect(factories.length).toEqual(1);

    const molecule = new Molecule();

    // setup atoms
    const atom_start = new ProgramStartAtom();
    const atom_end = new ProgramEndAtom();
    const atom_custom = (factories[0] as CustomCarbonAtomFactory).generateAtom();

    molecule.addAtom(atom_start);
    molecule.addAtom(atom_end);
    molecule.addAtom(atom_custom);

    (atom_end.getInPorts()[0] as FlowPort).link(atom_custom.getOutPort(CustomCarbonRuntimeAtom.PORT_OUT));
    atom_custom.getInPort<FlowPort>(CustomCarbonRuntimeAtom.PORT_IN).link(atom_start.getOutPorts()[0] as FlowPort);

    const program = new Program(molecule, {
      logger: new Logger({
        name: 'PROGRAM',
        level: LogLevel.DEBUG,
        transport: new ColourConsoleLoggerTransport()
      })
    });
    program.compile();

    await program.run();
  });
});
