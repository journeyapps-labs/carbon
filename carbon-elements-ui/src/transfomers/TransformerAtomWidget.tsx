import { AtomPort } from '@journeyapps-labs/carbon-core';
import * as React from 'react';
import styled from '@emotion/styled';
import { DiagramEngine, NodeModel } from '@projectstorm/react-diagrams-core';
import { BaseNodeWidget, SmartPortWidget, StormUIBank, useCarbonTheme } from '@journeyapps-labs/carbon-ui-storm';
import { AbstractTransformerAtom } from '@journeyapps-labs/carbon-elements';
import { getTypeTheme } from '../utils';

export interface TransformerAtomWidgetProps {
  atom: AbstractTransformerAtom;
  node: NodeModel;
  renderPort?: (port: AtomPort, element: React.JSX.Element) => React.JSX.Element;
  readonly: boolean;
  engine: DiagramEngine;
  uiBank: StormUIBank;
}

export const TransformerAtomWidget: React.FC<TransformerAtomWidgetProps> = (props) => {
  const theme = useCarbonTheme();
  const typeTheme = getTypeTheme(theme, props.atom.valueType);

  return (
    <BaseNodeWidget
      selected={props.node.isSelected()}
      borderRadius={5}
      colors={{
        background: typeTheme.color,
        border: typeTheme.color
      }}
    >
      <S.Container>
        <S.Ports>
          {props.atom.getInPorts().map((port) => {
            return props.renderPort(port, <SmartPortWidget stormUIBank={props.uiBank} port={port} key={port.key} />);
          })}
        </S.Ports>
        <S.Label>{props.atom.label}</S.Label>
        <S.Ports>
          {props.atom.getOutPorts().map((port) => {
            return props.renderPort(port, <SmartPortWidget stormUIBank={props.uiBank} port={port} key={port.key} />);
          })}
        </S.Ports>
      </S.Container>
    </BaseNodeWidget>
  );
};

namespace S {
  export const Ports = styled.div``;

  export const Label = styled.div`
    font-weight: bold;
    white-space: nowrap;
    padding-left: 4px;
    padding-right: 4px;
  `;

  export const Container = styled.div`
    display: flex;
    align-items: center;
  `;
}
