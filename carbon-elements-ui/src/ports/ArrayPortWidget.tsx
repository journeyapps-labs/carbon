import * as React from 'react';
import { ArrayPort } from '@journeyapps-labs/carbon-elements';
import { SmartPortWidget, StormUIBank, styled } from '@journeyapps-labs/carbon-ui-storm';

export interface ArrayPortWidgetProps {
  port: ArrayPort;
  uiBank: StormUIBank;
}

export const ArrayPortWidget: React.FC<ArrayPortWidgetProps> = (props) => {
  return (
    <S.Container>
      <SmartPortWidget stormUIBank={props.uiBank} port={props.port.port} />
      <S.Arr>[]</S.Arr>
    </S.Container>
  );
};

namespace S {
  export const Container = styled.div`
    display: flex;
    align-items: center;
  `;

  export const Arr = styled.span`
    padding-left: 5px;
    padding-right: 5px;
    font-weight: bold;
    letter-spacing: 2px;
    background: black;
    color: white;
    font-size: 13px;
  `;
}
