import * as React from 'react';
import { useEffect } from 'react';
import { BaseProgram, ProgramStatus } from '@journeyapps-labs/carbon-core';
import { styled } from '../themed';
import { useForceUpdate } from '../hooks/useForceUpdate';

export interface DebugStormCarbonCanvasWidgetProps {
  program: BaseProgram;
  className?: any;
}

export const DebugStormCarbonCanvasWidget: React.FC<React.PropsWithChildren<DebugStormCarbonCanvasWidgetProps>> = (
  props
) => {
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    props.program.registerListener({
      statusChanged: ({ status }) => {
        forceUpdate();
      }
    });
  }, [props.program]);

  return (
    <S.Container className={props.className} status={props.program.status}>
      {props.children}
    </S.Container>
  );
};
namespace S {
  export const Container = styled.div<{ status: ProgramStatus }>`
    border: solid 2px ${(p) => p.theme.status[p.status]};
  `;
}
