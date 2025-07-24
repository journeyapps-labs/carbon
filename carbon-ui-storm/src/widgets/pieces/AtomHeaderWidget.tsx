import * as React from 'react';
import styled from '@emotion/styled';

export interface AtomHeaderWidgetProps {
  label: string;
  color: string;
  foreground: string;
  portIn?: React.JSX.Element;
  portOut?: React.JSX.Element;
  className?: any;

  padLeft?: boolean;
  padRight?: boolean;
  extraPadding?: number;
}

export const AtomHeaderWidget: React.FC<AtomHeaderWidgetProps> = (props) => {
  return (
    <S.Container className={props.className} background={props.color}>
      {props.portIn || null}
      <S.LabelText
        extraPadding={props.extraPadding || 0}
        padLeft={props.padLeft}
        padRight={props.padRight}
        forground={props.foreground}
      >
        {props.label}
      </S.LabelText>
      {props.portOut || null}
    </S.Container>
  );
};
namespace S {
  export const Container = styled.div<{ background: string }>`
    background-color: ${(p) => p.background};
    background-image: linear-gradient(rgb(255, 255, 255, 0.05), rgba(255, 255, 255, 0));
    opacity: 0.8;
    display: flex;
    align-items: center;
    height: 26px;
    justify-content: space-between;
  `;

  export const LabelText = styled.div<{
    forground: string;
    padLeft?: boolean;
    padRight?: boolean;
    extraPadding: number;
  }>`
    flex-grow: 1;
    font-size: 13px;
    color: ${(p) => p.forground};
    font-family: 'Open Sans';
    padding-left: ${(p) => (p.padLeft ? p.extraPadding + 12 : 7)}px;
    padding-right: ${(p) => (p.padRight ? p.extraPadding + 12 : 7)}px;
    user-select: none;
    white-space: nowrap;
  `;
}
