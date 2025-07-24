import {
  FlowPort,
  ProgramEndAtom,
  ProgramEndFactory,
  ProgramStartAtom,
  ProgramStartFactory
} from '@journeyapps-labs/carbon-core';
import { CarbonJsonSerializer } from '../src/json/CarbonJsonSerializer';
import { createMolecule } from './fixtures/createMolecule';
import { CarbonXMLSerializer } from '../src';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';

vi.mock('uuid', () => {
  let UUID_ID = 0;

  return {
    v4: () => {
      return `${UUID_ID++}`;
    }
  };
});

describe('Serialization tests', () => {
  const jestConsole = console;

  beforeEach(() => {
    global.console = require('console');
  });

  afterEach(() => {
    global.console = jestConsole;
  });

  it('should serialize a JSON molecule', async () => {
    const serializer = new CarbonJsonSerializer({
      factories: [new ProgramStartFactory(), new ProgramEndFactory()]
    });

    const { molecule } = createMolecule();

    const data = serializer.serializeMolecule(molecule);
    expect(data).toMatchSnapshot();

    const molecule2 = serializer.deSerializeMolecule(data);
    expect(molecule2.getAtomById('0').type).toEqual(ProgramStartFactory.TYPE);
    expect(molecule2.getAtomById('1').type).toEqual(ProgramEndFactory.TYPE);
    expect(molecule2.getAtomById('0').getOutPort<FlowPort>(ProgramStartAtom.PORT_START).linked).toBe(
      molecule2.getAtomById('1').getInPort(ProgramEndAtom.PORT_END)
    );
  });

  it('Should serialize an XML molecule', async () => {
    const serializer = new CarbonXMLSerializer({
      factories: [new ProgramStartFactory(), new ProgramEndFactory()]
    });
    const { molecule, atom_start, atom_end } = createMolecule();
    const data = serializer.serializeMolecule(molecule);
    expect(data).toMatchSnapshot();

    const molecule2 = serializer.deSerializeMolecule(data);
    expect(molecule2.getAtomById(atom_start.id).type).toEqual(ProgramStartFactory.TYPE);
    expect(molecule2.getAtomById(atom_end.id).type).toEqual(ProgramEndFactory.TYPE);
    expect(molecule2.getAtomById(atom_start.id).getOutPort<FlowPort>(ProgramStartAtom.PORT_START).linked).toBe(
      molecule2.getAtomById(atom_end.id).getInPort(ProgramEndAtom.PORT_END)
    );
  });
});
