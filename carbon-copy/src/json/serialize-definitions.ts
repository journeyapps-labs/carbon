export interface Point {
  x: number;
  y: number;
}

export interface MoleculeSerialized {
  atoms: ElementSerialized[];
  annotations: ElementSerialized[];
  links: AtomLinkSerialized[];
}

export interface ElementSerialized extends Point {
  id: string;
  type: string;
}

export interface AtomLinkSerialized {
  target: AtomPortSerialized;
  source: AtomPortSerialized;
  points: Point[];
}

export interface AtomPortSerialized {
  atom_id: string;
  port_key: string;
}
