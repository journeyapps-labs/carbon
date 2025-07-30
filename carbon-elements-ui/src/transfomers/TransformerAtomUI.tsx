import * as React from 'react';
import { PortWidget } from '@projectstorm/react-diagrams-core';
import { StormAtomUI, StormAtomUIRenderEvent, StormPortWidget } from '@journeyapps-labs/carbon-ui-storm';

import { TransformerAtomWidget } from './TransformerAtomWidget';
import { AbstractTransformerAtom } from '@journeyapps-labs/carbon-elements';

export class TransformerAtomUI extends StormAtomUI {
  render(event: StormAtomUIRenderEvent<AbstractTransformerAtom>): React.JSX.Element {
    return (
      <TransformerAtomWidget
        uiBank={this.bank}
        node={event.event.model}
        engine={event.engine?.diagramEngine}
        readonly={event.readonly}
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
