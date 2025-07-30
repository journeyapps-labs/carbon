import * as React from 'react';
import { Atom, AtomPort, FlowPort } from '@journeyapps-labs/carbon-core';
import { AtomHeaderWidget } from '../pieces/AtomHeaderWidget';
import { useCarbonTheme } from '../../themed';
import { useEffect } from 'react';
import { useForceUpdate } from '../../hooks/useForceUpdate';
import { SmartPortWidget } from '../ports/SmartPortWidget';
import { StormUIBank } from '../../ui/StormUIBank';

export const SmartHeaderWidget: React.FC<{
  atom: Atom;
  renderPort?: (port: AtomPort, element: React.JSX.Element) => React.JSX.Element;
  uiBank: StormUIBank;

  padLeft?: boolean;
  padRight?: boolean;
  extraPadding?: number;
}> = (props) => {
  const update = useForceUpdate();
  useEffect(() => {
    return props.atom.registerListener({
      labelUpdated: () => {
        update();
      }
    });
  }, []);

  let inElement = null;
  let outElement = null;

  let inFlowPorts = props.atom.getInPorts().filter((p) => p instanceof FlowPort);
  let outFlowPorts = props.atom.getOutPorts().filter((p) => p instanceof FlowPort);
  if (inFlowPorts.length === 1) {
    inElement = <SmartPortWidget stormUIBank={props.uiBank} port={inFlowPorts[0]} />;
    inElement = props.renderPort ? props.renderPort(inFlowPorts[0], inElement) : inElement;
  }
  if (outFlowPorts.length === 1) {
    outElement = <SmartPortWidget stormUIBank={props.uiBank} port={outFlowPorts[0]} />;
    outElement = props.renderPort ? props.renderPort(outFlowPorts[0], outElement) : outElement;
  }

  const theme = useCarbonTheme();

  return (
    <AtomHeaderWidget
      foreground={theme.genericNode.titleForeground}
      portIn={inElement}
      portOut={outElement}
      color={theme.genericNode.titleBackground}
      label={props.atom.label}
      padLeft={props.padLeft}
      padRight={props.padRight}
      extraPadding={props.extraPadding}
    />
  );
};
