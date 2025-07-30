import * as React from 'react';
import { AtomPort } from '@journeyapps-labs/carbon-core';
import { PortWidget } from '@projectstorm/react-diagrams-core';
import { CarbonStormEngine } from '../../CarbonStormEngine';
import { AtomNodeModel } from '../../models/atom/AtomNodeModel';

export interface StormPortWidgetProps {
  port: AtomPort;
  engine: CarbonStormEngine;
  model: AtomNodeModel;
}

export const StormPortWidget: React.FC<React.PropsWithChildren<StormPortWidgetProps>> = (props) => {
  if (!props.engine) {
    return props.children as React.JSX.Element;
  }
  const port = props.model.getNodePort(props.port);
  if (!port) {
    return props.children as React.JSX.Element;
  }
  return (
    <PortWidget port={port} engine={props.engine.diagramEngine}>
      {props.children}
    </PortWidget>
  );
};
