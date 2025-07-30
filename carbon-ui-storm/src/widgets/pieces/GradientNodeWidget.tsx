import * as React from 'react';
import { styled } from '../../themed';

export interface GradientNodeWidgetProps {
  borderRadius?: number;
  selected: boolean;
  colors: {
    color1: string;
    color2: string;
  };
}

export const GradientNodeWidget: React.FC<React.PropsWithChildren<GradientNodeWidgetProps>> = (props) => {
  return (
    <S.Container
      selected={props.selected}
      borderRadius={props.borderRadius}
      color1={props.colors.color1}
      color2={props.colors.color2}
    >
      {props.children}
    </S.Container>
  );
};

namespace S {
  export const Container = styled.div<{
    borderRadius: number;
    color1: string;
    color2: string;
    selected: boolean;
  }>`
    border-radius: ${(p) => p.borderRadius || 10}px;
    overflow: hidden;
    border: solid 2px ${(p) => (p.selected ? p.theme.interactions.selected : 'black')};
    background:
      linear-gradient(90deg, ${(p) => p.color1}, ${(p) => p.color2}),
      linear-gradient(145deg, rgb(255, 255, 255, 0.25), rgba(255, 255, 255, 0));
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
  `;
}
