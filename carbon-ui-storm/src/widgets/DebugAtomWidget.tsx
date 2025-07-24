import * as React from 'react';
import { useEffect, useState } from 'react';
import { IconWidget } from './IconWidget';
import { ExecutorAtom, ProgramStatus } from '@journeyapps-labs/carbon-core';
import { useForceUpdate } from '../hooks/useForceUpdate';
import { keyframes } from '@emotion/react';
import { styled, useCarbonTheme } from '../themed';
import { AtomNodeModel } from '../models/atom/AtomNodeModel';

export interface DebugAtomWidgetProps {
  executor: ExecutorAtom;
  node: AtomNodeModel;
}

export const DebugAtomWidget: React.FC<React.PropsWithChildren<DebugAtomWidgetProps>> = (props) => {
  const [activated, setActivated] = useState<boolean>(false);
  const forceUpdate = useForceUpdate();
  const theme = useCarbonTheme();
  useEffect(() => {
    return props.executor.registerListener({
      pausedChanged: () => {
        forceUpdate();
      },
      breakOnPause: () => {
        setActivated(true);
      },
      contextGenerated: ({ invocation, context }) => {
        const l = context.registerListener({
          started: () => {},
          completed: () => {
            setActivated(false);
            l?.();
          }
        });
      }
    });
  }, [props.executor]);

  return (
    <S.Container>
      <S.Top>
        <S.Button
          onClick={() => {
            props.executor.setPaused(!props.executor.paused);
          }}
        >
          <IconWidget
            color="rgba(255,255,255,0.2)"
            size={10}
            icon={{
              fa: props.executor.paused ? 'play' : 'pause'
            }}
          />
        </S.Button>
      </S.Top>
      <S.Children
        break={activated}
        color={activated ? theme.status[ProgramStatus.RUNNING] : theme.status[ProgramStatus.STOPPED]}
        activated={props.executor.paused}
      >
        {props.children}
      </S.Children>
    </S.Container>
  );
};
namespace S {
  const steam = keyframes`
    0% {
      background-position: left top, right bottom, left bottom, right top;
    }
    100% {
      background-position: left 15px top, right 15px bottom, left bottom 15px, right top 15px;
    }
  `;

  export const Container = styled.div``;

  export const Children = styled.div<{ activated: boolean; color: string; break: boolean }>`
    background: ${(p) =>
      p.activated
        ? `linear-gradient(90deg, ${p.color} 50%, transparent 50%), linear-gradient(90deg, ${p.color} 50%, transparent 50%), linear-gradient(0deg, ${p.color} 50%, transparent 50%), linear-gradient(0deg, ${p.color} 50%, transparent 50%)`
        : ``};
    background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
    background-size:
      15px 2px,
      15px 2px,
      2px 15px,
      2px 15px;
    background-position:
      left top,
      right bottom,
      left bottom,
      right top;
    padding: 3px;
    animation: ${steam} ${(p) => (p.break ? 0.2 : 2)}s infinite linear;
    box-sizing: border-box;
  `;

  export const Top = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-bottom: 5px;
    padding-right: 2px;
  `;

  export const Button = styled.div`
    cursor: pointer;
  `;
}
