import * as React from 'react';
import { Atom, AtomPortType, AttributePort, ExecutorAtom, FlowPort } from '@journeyapps-labs/carbon-core';
import { GenericAtomWidget } from '../src/ui/types/generic/GenericAtomWidget';
import '../src/fonts';
import { StormUIBank } from '../src';

const stormUI = new StormUIBank();

class SimpleAtom extends Atom {
  constructor() {
    super('simple');
  }

  protected _generateExecutorAtom(): ExecutorAtom {
    return undefined;
  }
}

export const Comp = () => {
  const atom = new SimpleAtom();
  atom.addPort(
    new AttributePort('unknown', {
      key: 'port-1',
      type: AtomPortType.IN
    })
  );
  atom.addPort(
    new AttributePort('unknown', {
      key: 'port-2',
      type: AtomPortType.IN
    })
  );
  atom.addPort(
    new AttributePort('unknown', {
      key: 'port-3',
      type: AtomPortType.OUT
    })
  );

  return <GenericAtomWidget engine={null} stormUIBank={stormUI} atom={atom} />;
};

export const Comp_Flow = () => {
  const atom = new SimpleAtom();
  atom.addPort(
    new FlowPort({
      key: 'port-1',
      type: AtomPortType.IN
    })
  );
  atom.addPort(
    new AttributePort('unknown', {
      key: 'port-2',
      type: AtomPortType.IN
    })
  );
  atom.addPort(
    new AttributePort('unknown', {
      key: 'port-3',
      type: AtomPortType.OUT
    })
  );

  return <GenericAtomWidget engine={null} stormUIBank={stormUI} atom={atom} />;
};

export default {
  title: 'Simple Node',
  component: Comp,
  parameters: {
    layout: 'centered'
  }
};
