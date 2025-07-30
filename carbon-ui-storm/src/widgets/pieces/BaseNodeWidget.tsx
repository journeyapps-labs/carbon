import * as React from 'react';
import { styled } from '../../themed';

export interface BaseNodeWidgetProps {
  borderRadius?: number;
  selected: boolean;
  colors: {
    border: string;
    background: string;
  };
  tooltip?: string;
  action?: (event: React.MouseEvent) => any;
}

export const BaseNodeWidget: React.FC<React.PropsWithChildren<BaseNodeWidgetProps>> = (props) => {
  return (
    <S.Container
      title={props.tooltip}
      onContextMenu={(event) => {
        if (!props.action) {
          return;
        }
        event.stopPropagation();
        event.preventDefault();
        props.action(event);
      }}
      selected={props.selected}
      borderRadius={props.borderRadius}
      border={props.colors.border}
      background={props.colors.background}
    >
      {props.children}
    </S.Container>
  );
};

namespace S {
  export const Container = styled.div<{ borderRadius: number; background: string; border: string; selected: boolean }>`
    border-radius: ${(p) => p.borderRadius || 10}px;
    background-color: ${(p) => p.background};
    overflow: hidden;
    border: solid 2px ${(p) => (p.selected ? p.theme.interactions.selected : p.border)};
    background-image: linear-gradient(145deg, rgb(255, 255, 255, 0.25), rgba(255, 255, 255, 0));
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
  `;
}
