import * as React from 'react';
import { PortLabelModel } from './PortLabelModel';
import { styled } from '../themed';
import { getTransparentColor } from '../utils';
import { AtomPortType } from '@journeyapps-labs/carbon-core';
import { PortTheme } from '@journeyapps-labs/carbon-ui';
import { useEffect } from 'react';
import { CarbonStormEngine } from '../CarbonStormEngine';
import { useForceUpdate } from '../hooks/useForceUpdate';
import * as _ from 'lodash';

export interface PortLabelWidgetProps {
  port: PortLabelModel;
  engine: CarbonStormEngine;
}

export const PortLabelWidget: React.FC<PortLabelWidgetProps> = (props) => {
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    return props.engine.registerListener({
      sizeChanged: () => {
        forceUpdate();
      }
    });
  }, [props.port]);

  useEffect(() => {
    _.defer(() => {
      forceUpdate();
    });
  }, []);

  const bounding = props.port.port.getBoundingBox();
  const tr = bounding.getTopRight();
  const tl = bounding.getTopRight();

  if (!props.port.port.reportedPosition) {
    return null;
  }

  let style = {
    top: tr.y
  };
  if (props.port.attribute.type === AtomPortType.OUT) {
    style['left'] = tr.x;
  } else {
    style['right'] = props.port.engine.width - tl.x + bounding.getWidth();
  }

  return (
    <S.Container
      portTheme={props.port.theme}
      type={props.port.attribute.type}
      height={bounding.getHeight()}
      style={style}
    >
      {props.port.label}
    </S.Container>
  );
};
namespace S {
  const RADIUS = 5;

  export const Container = styled.div<{ height: number; type: AtomPortType; portTheme: PortTheme }>`
    background: ${(p) => getTransparentColor(p.portTheme.color, 0.5)};
    color: ${(p) => p.portTheme.icon};
    font-size: 12px;
    font-family: 'Open Sans';
    padding-left: 5px;
    padding-right: 6px;
    height: ${(p) => p.height}px;
    line-height: ${(p) => p.height}px;
    vertical-align: middle;
    position: absolute;
    white-space: nowrap;
    border-top-right-radius: ${(p) => (p.type === AtomPortType.OUT ? RADIUS : 0)}px;
    border-bottom-right-radius: ${(p) => (p.type === AtomPortType.OUT ? RADIUS : 0)}px;
    border-top-left-radius: ${(p) => (p.type === AtomPortType.IN ? RADIUS : 0)}px;
    border-bottom-left-radius: ${(p) => (p.type === AtomPortType.IN ? RADIUS : 0)}px;
  `;
}
