import * as React from 'react';
import styled from '@emotion/styled';
import { AtomPortType } from '@journeyapps-labs/carbon-core';
import { Icon } from '../common';
import { IconWidget } from '../IconWidget';
import { css } from '@emotion/react';
import { getTransparentColor } from '../../utils';

export interface PortWidgetProps {
  icon: Icon;
  side: AtomPortType;
  color: string;
  iconColor: string;
  iconSize?: number;
  connected?: boolean;
}

export const PortWidget: React.FC<PortWidgetProps> = (props) => {
  return (
    <S.Container connected={props.connected} background={props.color} input={props.side === AtomPortType.IN}>
      <IconWidget icon={props.icon} color={props.iconColor} size={props.iconSize || 16} />
    </S.Container>
  );
};

namespace S {
  const RADIUS = 8;
  const PORT_SIZE = 18;

  const inputsBorder = css`
    border-top-right-radius: ${RADIUS}px;
    border-bottom-right-radius: ${RADIUS}px;
  `;

  const outputsBorder = css`
    border-top-left-radius: ${RADIUS}px;
    border-bottom-left-radius: ${RADIUS}px;
  `;

  export const Container = styled.div<{ background: string; input: boolean; connected: boolean }>`
    width: ${PORT_SIZE}px;
    height: ${PORT_SIZE}px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: solid 2px ${(p) => p.background};
    ${(p) => (p.input ? 'border-left: none' : 'border-right: none')};
    background-color: ${(p) => (p.connected ? p.background : getTransparentColor(p.background, 0.5))};
    ${(p) => (p.input ? inputsBorder : outputsBorder)};

    &:hover {
      background-color: ${(p) => p.background};
    }
  `;
}
