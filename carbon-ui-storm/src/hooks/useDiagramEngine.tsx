import { Atom, Molecule } from '@journeyapps-labs/carbon-core';
import { CarbonStormEngine } from '../CarbonStormEngine';
import { CarbonDiagramModel } from '../models/CarbonDiagramModel';
import { AtomNodeModel } from '../models/atom/AtomNodeModel';

export interface GenerateDiagramParams {
  molecule: Molecule;
  engine: CarbonStormEngine;
}

export const generateDiagram = (options: GenerateDiagramParams) => {
  const { molecule, engine } = options;
  let newModel = new CarbonDiagramModel(molecule, engine);

  // construct atoms
  let map = new Map<Atom, AtomNodeModel>();
  for (let m of molecule.atoms.values()) {
    let node = new AtomNodeModel(m, engine);
    map.set(m, node);
    newModel.addNode(node);
  }

  // annotations
  for (let a of molecule.annotations.values()) {
    newModel.annotationLayer.addAnnotation(a);
  }

  // construct links
  for (let m of molecule.atoms.values()) {
    for (let p of m.getInPorts()) {
      map.get(m).setupPortLinks(p, newModel);
    }
  }
  return newModel;
};
