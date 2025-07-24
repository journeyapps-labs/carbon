import {
  AbstractReactFactory,
  BasePositionModel,
  GenerateModelEvent,
  GenerateWidgetEvent
} from '@projectstorm/react-canvas-core';
import { AnnotationElement, TextAnnotationElementFactory, TextAnnotationElement } from '@journeyapps-labs/carbon-core';
import * as React from 'react';
import { useRef } from 'react';
import { styled } from '../themed';
import { getTransparentColor } from '../utils';
import { setupStormModel } from '../models/element/BaseElementStormModel';
import { CarbonStormEngine } from '../CarbonStormEngine';

export class AnnotationStormModel extends setupStormModel<BasePositionModel, TextAnnotationElement>(BasePositionModel) {
  constructor(
    element: TextAnnotationElement,
    public engine: CarbonStormEngine
  ) {
    super({
      type: TextAnnotationElementFactory.TYPE
    });
    this.setElement(element);
  }
}

export class AnnotationElementStormFactory extends AbstractReactFactory<AnnotationStormModel> {
  constructor(protected stormEngine: CarbonStormEngine) {
    super(TextAnnotationElementFactory.TYPE);
  }

  generateModel(event: GenerateModelEvent): AnnotationStormModel {
    return new AnnotationStormModel(event.initialConfig.annotation, this.stormEngine);
  }

  generateReactWidget(event: GenerateWidgetEvent<AnnotationStormModel>): React.JSX.Element {
    return <TextAnnotationWidget model={event.model} />;
  }
}

namespace S {
  export const TextAnnotation = styled.div`
    display: grid;
    user-select: none;
    cursor: move;
    pointer-events: all;
    color: ${(p) => p.theme.textAnnotationColor};
    outline: none;
    white-space: nowrap;
  `;

  export const Parent = styled.div`
    padding-left: 8px;
    position: absolute;
    border-left: solid 4px ${(p) => getTransparentColor(p.theme.textAnnotationColor, 0.5)};
  `;
}

export interface TextAnnotationWidgetProps {
  model: AnnotationStormModel;
}

export const TextAnnotationWidget: React.FC<TextAnnotationWidgetProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <S.Parent
      className="annotation"
      data-annotationid={props.model.getID()}
      onContextMenu={(event) => {
        event.stopPropagation();
        event.preventDefault();
        props.model.engine.showOptionsForElement(props.model.element, event);
      }}
      style={{
        top: props.model.getY(),
        left: props.model.getX()
      }}
    >
      <S.TextAnnotation
        onInput={(event) => {
          props.model.element.text = event.currentTarget.innerText;
        }}
        contentEditable={true}
        ref={ref}
      >
        {props.model.element.text}
      </S.TextAnnotation>
    </S.Parent>
  );
};
