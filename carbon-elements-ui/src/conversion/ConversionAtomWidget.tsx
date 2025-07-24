import { AtomPort } from '@journeyapps-labs/carbon-core';
import * as React from 'react';
import styled from '@emotion/styled';
import { NodeModel } from '@projectstorm/react-diagrams-core';
import { GradientNodeWidget, SmartPortWidget, StormUIBank, useCarbonTheme } from '@journeyapps-labs/carbon-ui-storm';
import { TypedPort, ValueType } from '@journeyapps-labs/carbon-elements';
import { getTypeTheme } from '../utils';
import { AbstractConversionAtom } from '@journeyapps-labs/carbon-elements';

export interface ConversionAtomWidgetProps {
  atom: AbstractConversionAtom;
  node: NodeModel;
  renderPort?: (port: AtomPort, element: React.JSX.Element) => React.JSX.Element;
  readonly: boolean;
  uiBank: StormUIBank;
}

export const ConversionAtomWidget: React.FC<ConversionAtomWidgetProps> = (props) => {
  const theme = useCarbonTheme();
  const port1 = props.atom.getInPorts<TypedPort>()[0];
  const port2 = props.atom.getOutPorts<TypedPort>()[0];
  const theme1 = getTypeTheme(theme, port1.valueType as ValueType);
  const theme2 = getTypeTheme(theme, port2.valueType as ValueType);

  return (
    <GradientNodeWidget
      selected={props.node.isSelected()}
      borderRadius={5}
      colors={{
        color1: theme1.color,
        color2: theme2.color
      }}
    >
      <S.Container>
        {props.renderPort(port1, <SmartPortWidget stormUIBank={props.uiBank} port={port1} />)}
        <S.Label>{props.atom.label}</S.Label>
        {props.renderPort(port2, <SmartPortWidget stormUIBank={props.uiBank} port={port2} />)}
      </S.Container>
    </GradientNodeWidget>
  );
};

namespace S {
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
