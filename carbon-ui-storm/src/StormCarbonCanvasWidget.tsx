import * as React from 'react';
import styled from '@emotion/styled';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { Molecule } from '@journeyapps-labs/carbon-core';
import { useEffect, useRef } from 'react';
import { CarbonStormEngine } from './CarbonStormEngine';

export interface StormCarbonCanvasWidgetProps {
  className?: any;
  molecule: Molecule;
  engine: CarbonStormEngine;
  forwardRef?: React.RefObject<HTMLDivElement>;
}

export const StormCarbonCanvasWidget: React.FC<StormCarbonCanvasWidgetProps> = (props) => {
  const ref = props.forwardRef || useRef<HTMLDivElement>(null);
  useEffect(() => {
    props.engine.setMolecule(props.molecule);
  }, [props.molecule]);

  useEffect(() => {
    return () => {
      props.engine.getModel().dispose();
    };
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const bounds = ref.current.getBoundingClientRect();
      props.engine.setBounds(bounds.width, bounds.height);
    });

    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <S.Container ref={ref} className={props.className}>
      {props.engine.diagramEngine ? <S.Canvas engine={props.engine.diagramEngine} /> : null}
    </S.Container>
  );
};
namespace S {
  export const Container = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
  `;

  export const Canvas = styled(CanvasWidget)`
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: absolute;
  `;
}
