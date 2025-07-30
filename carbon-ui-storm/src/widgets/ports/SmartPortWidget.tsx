import * as React from 'react';
import { AtomPort, AttributePort, FlowPort, PlaceholderPort } from '@journeyapps-labs/carbon-core';
import { FlowPortWidget } from './FlowPortWidget';
import { StormUIBank } from '../../ui/StormUIBank';
import { PlaceholderPortWidget } from './PlaceholderPortWidget';
import { useForceUpdate } from '../../hooks/useForceUpdate';
import { useEffect } from 'react';

export interface SmartPortWidgetProps {
  port: AtomPort;
  stormUIBank: StormUIBank;
}

export const SmartPortWidget: React.FC<SmartPortWidgetProps> = (props) => {
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    return props.port.registerListener({
      linkUpdated: () => {
        forceUpdate();
      }
    });
  }, [props.port]);

  if (props.port instanceof FlowPort) {
    return <FlowPortWidget connected={props.port.connected()} side={props.port.type} />;
  }
  if (props.port instanceof PlaceholderPort) {
    return <PlaceholderPortWidget connected={props.port.connected()} side={props.port.type} />;
  }

  return props.stormUIBank
    .getUIForType((props.port as AttributePort).valueType)
    .generatePortWidget(props.port as AttributePort);
};
