import * as React from 'react';
import { StormAtomUI, StormAtomUIRenderEvent } from '../../StormAtomUI';
import { GenericAtomWidget } from './GenericAtomWidget';
import { StormUIBank } from '../../StormUIBank';
import { StormPortWidget } from '../../../widgets/ports/StormPortWidget';

export class GenericStormAtomUI extends StormAtomUI {
  constructor(protected stormUIBank: StormUIBank) {
    super('generic');
  }

  render(event: StormAtomUIRenderEvent): React.JSX.Element {
    return (
      <GenericAtomWidget
        engine={event.engine}
        stormUIBank={this.stormUIBank}
        node={event.event.model}
        renderPort={(port, element) => {
          return (
            <StormPortWidget port={port} engine={event.engine} model={event.event.model}>
              {element}
            </StormPortWidget>
          );
        }}
        atom={event.event.model.atom}
      />
    );
  }
}
