import { AtomPort } from '@journeyapps-labs/carbon-core';
import * as React from 'react';
import styled from '@emotion/styled';
import { DiagramEngine, NodeModel } from '@projectstorm/react-diagrams-core';
import { InputType } from '@projectstorm/react-canvas-core';
import AutosizeInput from 'react-input-autosize';
import * as _ from 'lodash';
import {
  BaseNodeWidget,
  CarbonStormEngine,
  SmartPortWidget,
  StormUIBank,
  useCarbonTheme,
  useForceUpdate
} from '@journeyapps-labs/carbon-ui-storm';
import { BaseConstantAtom } from '@journeyapps-labs/carbon-elements';
import { CarbonTheme, PortTheme } from '@journeyapps-labs/carbon-ui';

export interface ConstantAtomWidgetProps {
  atom: BaseConstantAtom;
  node: NodeModel;
  renderPort?: (port: AtomPort, element: React.JSX.Element) => React.JSX.Element;
  readonly: boolean;
  engine: CarbonStormEngine;
  uiBank: StormUIBank;
  validate: (text: string) => boolean;
  getPortTheme: (theme: CarbonTheme) => PortTheme;
}

export const ConstantAtomWidget: React.FC<ConstantAtomWidgetProps> = (props) => {
  const port = props.atom.getOutPorts()[0];
  const portWidget = <SmartPortWidget stormUIBank={props.uiBank} port={port} key={port.key} />;
  const theme = useCarbonTheme();
  const forceUpdate = useForceUpdate();
  const portTheme = props.getPortTheme(theme);
  return (
    <BaseNodeWidget
      selected={props.node.isSelected()}
      borderRadius={5}
      colors={{
        background: portTheme.color,
        border: portTheme.color
      }}
    >
      <S.Port>
        <AutosizeInput
          inputStyle={{
            outline: 'none',
            border: 'none',
            background: 'transparent',
            minWidth: 50
          }}
          value={`${props.atom.value}`}
          onKeyDownCapture={(event) => {
            if (event.key === 'Backspace') {
              let lock = props.engine.acquireInteractionLock();
              _.defer(() => {
                lock();
              });
            }
          }}
          onChange={({ target }) => {
            if (!props.validate(target.value)) {
              return;
            }
            props.atom.setValue(target.value);
            forceUpdate();
          }}
        />
        {props.renderPort ? props.renderPort(port, portWidget) : portWidget}
      </S.Port>
    </BaseNodeWidget>
  );
};

namespace S {
  export const Port = styled.div`
    display: flex;
  `;

  export const Container = styled.div`
    display: flex;
    justify-content: space-between;
  `;
}
