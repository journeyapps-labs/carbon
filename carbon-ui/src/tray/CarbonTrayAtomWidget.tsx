import * as React from 'react';
import { RenderedTrayElement, RenderingEngine } from '../RenderingEngine';
import { ElementFactory } from '@journeyapps-labs/carbon-core';
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';

export interface CarbonTrayAtomWidgetProps {
  factory: ElementFactory;
  className?: any;
  scale?: number;
  engine: RenderingEngine;
}

export const CarbonTrayAtomWidget: React.FC<CarbonTrayAtomWidgetProps> = (props) => {
  const [element, setElement] = useState<RenderedTrayElement>();
  useEffect(() => {
    props.engine
      .renderElementForTray({
        factory: props.factory
      })
      .then((element) => {
        setElement(element);
      });
  }, []);

  if (!element) {
    return null;
  }

  if (!element.width && !element.height) {
    return element.element;
  }

  return (
    <S.Scale scale={props.scale} width={element.width} height={element.height}>
      <S.Content scale={props.scale}>{element.element}</S.Content>
    </S.Scale>
  );
};

namespace S {
  export const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px;
  `;

  export const Content = styled.div<{ scale: number }>`
    transform: scale(${(p) => p.scale});
    transform-origin: top left;
    position: absolute;
    pointer-events: none;
  `;

  export const Scale = styled.div<{ width: number; height: number; scale: number }>`
    position: relative;
    width: ${(p) => p.width * p.scale}px;
    height: ${(p) => p.height * p.scale}px;
    pointer-events: all;
  `;
}
