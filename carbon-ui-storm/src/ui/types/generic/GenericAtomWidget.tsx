import * as React from 'react';
import { Atom, AtomPort, AtomPortType } from '@journeyapps-labs/carbon-core';
import { BaseNodeWidget } from '../../../widgets/pieces/BaseNodeWidget';
import styled from '@emotion/styled';
import { SmartHeaderWidget } from '../../../widgets/pieces-smart/SmartHeaderWidget';
import { SmartPortsWidget, useContentPorts } from '../../../widgets/pieces-smart/SmartPortsWidget';
import { NodeModel } from '@projectstorm/react-diagrams-core';
import { useCarbonTheme } from '../../../themed';
import { StormUIBank } from '../../StormUIBank';
import { CarbonStormEngine } from '../../../CarbonStormEngine';
import * as _ from 'lodash';

export interface GenericAtomWidgetProps {
  atom: Atom;
  node?: NodeModel;
  renderPort?: (port: AtomPort, element: React.JSX.Element) => React.JSX.Element;
  stormUIBank: StormUIBank;
  engine: CarbonStormEngine;
}

export const GenericAtomWidget: React.FC<GenericAtomWidgetProps> = (props) => {
  const theme = useCarbonTheme();
  let portsIn = useContentPorts({
    ports: _.sortBy(props.atom.getInPorts(), (p) => p.orderValue)
  });
  let portsOut = useContentPorts({
    ports: _.sortBy(props.atom.getOutPorts(), (p) => p.orderValue)
  });
  return (
    <BaseNodeWidget
      action={(event) => {
        props.engine.showOptionsForElement(props.atom, event);
      }}
      selected={props.node?.isSelected()}
      borderRadius={theme.genericNode.borderRadius}
      colors={{
        background: theme.genericNode.background,
        border: theme.genericNode.borderColor
      }}
    >
      <SmartHeaderWidget uiBank={props.stormUIBank} atom={props.atom} renderPort={props.renderPort} />
      <S.Container>
        <SmartPortsWidget
          stormUIBank={props.stormUIBank}
          renderPort={props.renderPort}
          ports={portsIn}
          type={AtomPortType.IN}
        />
        <S.Center />
        <SmartPortsWidget
          stormUIBank={props.stormUIBank}
          renderPort={props.renderPort}
          ports={portsOut}
          type={AtomPortType.OUT}
        />
      </S.Container>
    </BaseNodeWidget>
  );
};

namespace S {
  export const Center = styled.div`
    min-width: 10px;
  `;

  export const Container = styled.div`
    display: flex;
    padding-top: 5px;
    padding-bottom: 5px;
    justify-content: space-between;
  `;
}
