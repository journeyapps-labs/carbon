import { FlowPort, Molecule, ProgramEndAtom, ProgramStartAtom } from '@journeyapps-labs/carbon-core';

export const createMolecule = () => {
  const molecule = new Molecule();

  // setup atoms
  const atom_start = new ProgramStartAtom();
  const atom_end = new ProgramEndAtom();
  atom_start.id = '0';
  atom_end.id = '1';

  molecule.addAtom(atom_start);
  molecule.addAtom(atom_end);

  atom_end
    .getInPort<FlowPort>(ProgramEndAtom.PORT_END)
    .link(atom_start.getOutPort<FlowPort>(ProgramStartAtom.PORT_START));

  return {
    molecule,
    atom_start,
    atom_end
  };
};
