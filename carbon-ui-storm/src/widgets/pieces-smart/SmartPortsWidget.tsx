import * as React from 'react';
import { AtomPort, AtomPortType, AttributePort, FlowPort } from '@journeyapps-labs/carbon-core';
import { AtomPortsWidget } from '../pieces/AtomPortsWidget';
import styled from '@emotion/styled';
import { SmartPortWidget } from '../ports/SmartPortWidget';
import { StormUIBank } from '../../ui/StormUIBank';

export const useContentPorts = (props: { ports: AtomPort[] }) => {
  let ports = props.ports;

  if (ports.filter((p) => p instanceof FlowPort).length < 2) {
    ports = ports.filter((p) => p instanceof AttributePort);
  }

  if (ports.length === 0) {
    return [];
  }
  return ports;
};

export const SmartPortsWidget: React.FC<{
  className?: any;
  ports: AtomPort[];
  type: AtomPortType;
  renderPort?: (port: AtomPort, element: React.JSX.Element) => React.JSX.Element;
  stormUIBank: StormUIBank;
}> = (props) => {
  return (
    <S.Ports
      className={props.className}
      ports={props.ports}
      type={props.type}
      renderPort={(port) => {
        const e = <SmartPortWidget stormUIBank={props.stormUIBank} port={port} key={port.key} />;
        if (props.renderPort) {
          return props.renderPort(port, e);
        }
        return e;
      }}
    />
  );
};

namespace S {
  export const Ports = styled(AtomPortsWidget)`
    align-self: flex-start;
  `;
}
