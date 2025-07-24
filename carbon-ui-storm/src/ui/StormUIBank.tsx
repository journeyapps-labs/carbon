import { StormAtomUI } from './StormAtomUI';
import * as _ from 'lodash';
import * as React from 'react';
import { GenericStormAtomUI } from './types/generic/GenericStormAtomUI';
import { SpecificAtomUI } from './types/specific/SpecificAtomUI';
import { AtomUIBank } from '@journeyapps-labs/carbon-ui';
import { AttributePort } from '@journeyapps-labs/carbon-core';
import { PortWidget } from '../widgets/ports/PortWidget';

export interface StormTypeUI<T extends AttributePort = AttributePort> {
  matches: (valueType: string) => boolean;
  generatePortWidget: (port: T) => React.JSX.Element;
}

export class StormUIBank {
  atomUI: Map<string, StormAtomUI>;
  typeUI: Set<StormTypeUI>;
  generic: GenericStormAtomUI;

  constructor() {
    this.atomUI = new Map<string, StormAtomUI>();
    this.typeUI = new Set<StormTypeUI>();
    this.generic = new GenericStormAtomUI(this);
  }

  loadUIBank(bank: AtomUIBank) {
    for (let [key, value] of bank.ui.entries()) {
      this.registerStormAtomUI(
        new SpecificAtomUI({
          ui: value,
          type: key
        })
      );
    }
  }

  clear() {
    this.atomUI.clear();
    this.getUIForAtomType.cache.clear();
    this.getUIForType.cache.clear();
  }

  registerStormAtomUI(ui: StormAtomUI) {
    ui.setStormUIBank(this);
    this.atomUI.set(ui.type, ui);
  }

  registerStormTypeUI(ui: StormTypeUI) {
    this.typeUI.add(ui);
  }

  getUIForAtomType = _.memoize((type: string): StormAtomUI => {
    if (this.atomUI.has(type)) {
      return this.atomUI.get(type);
    }
    return this.generic;
  });

  getUIForType = _.memoize((type: string): StormTypeUI => {
    for (let matcher of this.typeUI) {
      if (matcher.matches(type)) {
        return matcher;
      }
    }
    return {
      matches: () => true,
      generatePortWidget: (port) => {
        return (
          <PortWidget
            icon={{
              fa: 'question-circle'
            }}
            iconColor="black"
            color="rgb(200,200,200)"
            side={port.type}
          />
        );
      }
    };
  });
}
