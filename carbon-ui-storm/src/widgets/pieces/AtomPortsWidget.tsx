import * as React from 'react';
import styled from '@emotion/styled';
import { AtomPort, AtomPortType, AttributePort } from '@journeyapps-labs/carbon-core';
import { css } from '@emotion/react';
import { useCarbonTheme } from '../../themed';

export interface AtomPortsWidgetProps {
  ports: AtomPort[];
  type: AtomPortType;
  renderPort: (port: AtomPort) => React.JSX.Element;
  className?: any;
}

export const AtomPortsWidget: React.FC<AtomPortsWidgetProps> = (props) => {
  const theme = useCarbonTheme();

  return (
    <S.Container className={props.className} input={props.type === AtomPortType.IN}>
      {props.ports.map((port) => {
        let disabled = false;
        if (port instanceof AttributePort) {
          disabled = !port.required && !port.linked;
        }

        return (
          <S.PortContainer enabled={!disabled} background={theme.genericNode.portLabelBackground} key={port.key}>
            {props.type === AtomPortType.IN ? props.renderPort(port) : null}
            <S.PortLabel color={theme.genericNode.portLabelForeground}>{port.label}</S.PortLabel>
            {props.type === AtomPortType.OUT ? props.renderPort(port) : null}
          </S.PortContainer>
        );
      })}
    </S.Container>
  );
};
namespace S {
  const RADIUS = 10;

  const inputsBorder = css`
    border-top-right-radius: ${RADIUS}px;
    border-bottom-right-radius: ${RADIUS}px;
  `;

  const outputsBorder = css`
    border-top-left-radius: ${RADIUS}px;
    border-bottom-left-radius: ${RADIUS}px;
  `;

  export const Container = styled.div<{ input: boolean }>`
    overflow: hidden;
    ${(p) => (p.input ? inputsBorder : outputsBorder)}
  `;

  export const PortContainer = styled.div<{ background: string; enabled: boolean }>`
    background: ${(p) => p.background};
    display: flex;
    align-items: center;
    height: 23px;
    margin-bottom: 2px;
    flex-wrap: nowrap;
    flex-direction: row;
    opacity: ${(p) => (p.enabled ? 1 : 0.5)};

    &:last-of-type {
      margin-bottom: 0;
    }
  `;

  export const PortLabel = styled.div<{ color: string }>`
    color: ${(p) => p.color};
    font-weight: 400;
    font-size: 11px;
    flex-grow: 1;
    padding-left: 5px;
    padding-right: 5px;
    font-family: 'Open Sans';
    user-select: none;
    padding-bottom: 1px;
    white-space: nowrap;

    &:first-of-type {
      padding-left: 8px;
    }

    &:last-of-type {
      padding-right: 8px;
    }
  `;
}
