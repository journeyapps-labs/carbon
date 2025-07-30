import { AtomUI } from '@journeyapps-labs/carbon-ui';
import * as React from 'react';
import { StormAtomUI, StormAtomUIRenderEvent } from '../../StormAtomUI';
import { SpecificAtomWidget } from './SpecificAtomWidget';
import { StormPortWidget } from '../../../widgets/ports/StormPortWidget';

export interface SpecificAtomUIOptions {
  ui: AtomUI;
  type: string;
}

export class SpecificAtomUI extends StormAtomUI {
  constructor(public options: SpecificAtomUIOptions) {
    super(options.type);
  }

  render(event: StormAtomUIRenderEvent): React.JSX.Element {
    return (
      <SpecificAtomWidget
        engine={event.engine}
        stormUI={this.bank}
        node={event.event.model}
        atom={event.event.model.atom}
        atomUI={this.options.ui}
        renderPort={(port, element) => {
          return (
            <StormPortWidget port={port} engine={event.engine} model={event.event.model}>
              {element}
            </StormPortWidget>
          );
        }}
      />
    );
  }
}
