import * as React from 'react';
import { PortWidget } from '@projectstorm/react-diagrams-core';
import { StormAtomUI, StormAtomUIRenderEvent, StormPortWidget } from '@journeyapps-labs/carbon-ui-storm';
import { ConversionAtomWidget } from './ConversionAtomWidget';
import { AbstractConversionAtom } from '@journeyapps-labs/carbon-elements';

export class ConversionAtomUI extends StormAtomUI {
  render(event: StormAtomUIRenderEvent<AbstractConversionAtom>): React.JSX.Element {
    return (
      <ConversionAtomWidget
        node={event.event.model}
        uiBank={this.bank}
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
