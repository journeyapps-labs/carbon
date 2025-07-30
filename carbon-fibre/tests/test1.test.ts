import { FlowPort, Molecule, Program, ProgramEndAtom, ProgramStartAtom } from '@journeyapps-labs/carbon-core';
import { ProgramTransmitter, RemoteProgram, SimpleTransponder } from '../src';
import { ColourConsoleLoggerTransport, PrimaryConsoleColours } from '@journeyapps-labs/carbon-testing';
import { Logger, LogLevel } from '@journeyapps-labs/carbon-utils';
import { describe, beforeEach, afterEach, it, expect } from 'vitest';

describe('Flow tests', () => {
  const jestConsole = console;

  beforeEach(() => {
    global.console = require('console');
  });

  afterEach(() => {
    global.console = jestConsole;
  });

  it('should run a remote debugger', async () => {
    const molecule = new Molecule();
    const atom_start = new ProgramStartAtom();
    const atom_end = new ProgramEndAtom();

    atom_end.getInPort(ProgramEndAtom.PORT_END).link(atom_start.getOutPort(ProgramStartAtom.PORT_START));
    molecule.addAtom(atom_start);
    molecule.addAtom(atom_end);

    const program = new Program(molecule, {
      logger: new Logger({
        transport: new ColourConsoleLoggerTransport(),
        level: LogLevel.ERROR,
        name: 'LOCAL_PROGRAM'
      })
    });
    program.compile();

    const transponder1 = new SimpleTransponder();
    const transponder2 = new SimpleTransponder();

    transponder1.link(transponder2);

    // emitting program
    const transmitter = new ProgramTransmitter({
      transponder: transponder1,
      program: program
    });
    transmitter.init();

    // receiving program
    const program_remote = new RemoteProgram({
      transponder: transponder2,
      molecule: molecule,
      logger: new Logger({
        transport: new ColourConsoleLoggerTransport(PrimaryConsoleColours.CYAN),
        level: LogLevel.ERROR,
        name: 'REMOTE_PROGRAM'
      })
    });
    program_remote.compile();

    // remote program will respond
    program_remote.registerListener({
      statusChanged: ({ status }) => {}
    });

    expect(program_remote.executors.get(atom_start).executingContexts.size).toEqual(0);
    expect(program_remote.executors.get(atom_end).executingContexts.size).toEqual(0);

    await program.run();

    // there should be 2 contexts afterward
    expect(program_remote.executors.get(atom_start).executingContexts.size).toEqual(1);
    expect(program_remote.executors.get(atom_end).executingContexts.size).toEqual(1);
  });
});
