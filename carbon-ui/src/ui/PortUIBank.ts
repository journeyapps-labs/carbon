import { PortTheme } from '../theme/CarbonTheme';
import { AtomPort, AttributePort } from '@journeyapps-labs/carbon-core';

export interface PortUI {
  matches: (port: AttributePort) => boolean;
  theme: PortTheme;
}

export class PortUIBank {
  ui: Map<string, PortUI>;

  constructor() {
    this.ui = new Map<string, PortUI>();
  }

  registerUI(port: AttributePort, ui: PortUI) {
    this.ui.set(port.valueType, ui);
  }
}
