import { Atom, AtomPort, AtomPortType } from '@journeyapps-labs/carbon-core';
import * as React from 'react';
import { useEffect } from 'react';
import { BaseNodeWidget } from '../../../widgets/pieces/BaseNodeWidget';
import { SmartHeaderWidget } from '../../../widgets/pieces-smart/SmartHeaderWidget';
import { SmartPortsWidget, useContentPorts } from '../../../widgets/pieces-smart/SmartPortsWidget';
import styled from '@emotion/styled';
import {
  AtomImageAlignment,
  AtomUI,
  BuiltInThemes,
  ColorResolver,
  RenderingEngine,
  AtomBadgeAlignment
} from '@journeyapps-labs/carbon-ui';
import * as _ from 'lodash';
import { NodeModel } from '@projectstorm/react-diagrams-core';
import { useCarbonTheme } from '../../../themed';
import { useForceUpdate } from '../../../hooks/useForceUpdate';
import { StormUIBank } from '../../StormUIBank';
import { css } from '@emotion/react';

export interface SpecificAtomWidgetProps {
  atom: Atom;
  atomUI: AtomUI;
  stormUI: StormUIBank;
  engine: RenderingEngine;
  node: NodeModel;
  renderPort?: (port: AtomPort, element: React.JSX.Element) => React.JSX.Element;
}

const Image: React.FC<SpecificAtomWidgetProps> = (props) => {
  if (!props.atomUI.image) {
    return null;
  }
  return (
    <S.ImageContainer alignment={props.atomUI.image.alignment || AtomImageAlignment.CENTER}>
      <S.Image height={props.atomUI.image.height} width={props.atomUI.image.width} src={props.atomUI.image.src} />
    </S.ImageContainer>
  );
};

const MetaWidget: React.FC<SpecificAtomWidgetProps> = (props) => {
  const theme = useCarbonTheme();
  if (!props.atomUI.meta || _.keys(props.atomUI.meta).length === 0) {
    return null;
  }
  return (
    <>
      {_.map(props.atomUI.meta, (value, key) => {
        return (
          <S.Meta color={theme.genericNode.metaColor} key={key}>
            <S.MetaKey>{key}</S.MetaKey>
            <S.MetaValue>{value(props.atom)}</S.MetaValue>
          </S.Meta>
        );
      })}
    </>
  );
};

const Footer: React.FC<SpecificAtomWidgetProps> = (props) => {
  const theme = useCarbonTheme();
  if (!props.atomUI.footer) {
    return null;
  }
  const res = props.atomUI.footer(props.atom);
  if (!res) {
    return null;
  }
  return <S.Footer color={theme.genericNode.metaColor}>{res}</S.Footer>;
};

const resolveColor = (color: ColorResolver, theme: BuiltInThemes) => {
  if (_.isString(color)) {
    return color;
  }
  return color(theme);
};

export const SpecificAtomWidget: React.FC<SpecificAtomWidgetProps> = (props) => {
  const theme = useCarbonTheme();
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    let unregister = Array.from(props.atom.properties.values()).map((p) => {
      return p.registerListener({
        propertyChanged: () => {
          forceUpdate();
        }
      });
    });
    return () => {
      unregister.forEach((f) => f());
    };
  }, []);

  let portsIn = useContentPorts({
    ports: _.sortBy(props.atom.getInPorts(), (p) => p.orderValue)
  });
  let portsOut = useContentPorts({
    ports: _.sortBy(props.atom.getOutPorts(), (p) => p.orderValue)
  });

  const padLeft = props.atomUI.badge?.position === AtomBadgeAlignment.TL;
  const padRight = props.atomUI.badge?.position === AtomBadgeAlignment.TR;

  return (
    <>
      <BaseNodeWidget
        tooltip={props.atomUI.tooltip}
        action={(event) => {
          props.engine.showOptionsForElement(props.atom, event);
        }}
        selected={props.node.isSelected()}
        borderRadius={theme.genericNode.borderRadius}
        colors={{
          background: resolveColor(props.atomUI.color, theme.base),
          border: theme.genericNode.borderColor
        }}
      >
        <SmartHeaderWidget
          padLeft={padLeft}
          padRight={padRight}
          uiBank={props.stormUI}
          atom={props.atom}
          renderPort={props.renderPort}
          extraPadding={props.atomUI.badge?.extraPadding}
        />
        <Image {...props} />
        <MetaWidget {...props} />
        {portsIn.length > 0 || portsOut.length > 0 ? (
          <S.Container>
            <S.SmartPorts
              stormUIBank={props.stormUI}
              renderPort={props.renderPort}
              ports={portsIn}
              type={AtomPortType.IN}
            />
            <S.Center />
            <S.SmartPorts
              stormUIBank={props.stormUI}
              renderPort={props.renderPort}
              ports={portsOut}
              type={AtomPortType.OUT}
            />
          </S.Container>
        ) : null}
        <Footer {...props} />
      </BaseNodeWidget>
      {props.atomUI.badge ? (
        <S.Badge left={props.atomUI.badge.position === AtomBadgeAlignment.TL} src={props.atomUI.badge.src} />
      ) : null}
    </>
  );
};

namespace S {
  const tr = css`
    top: -10px;
    right: -20px;
  `;

  const tl = css`
    top: -10px;
    left: -20px;
  `;

  export const Badge = styled.img<{ left: boolean }>`
    ${(p) => (p.left ? tl : tr)};
    position: absolute;
  `;

  export const Center = styled.div`
    min-width: 10px;
  `;

  export const Meta = styled.div<{ color: string }>`
    display: flex;
    color: ${(p) => p.color};
    padding: 5px;
    font-family: 'Open Sans';
    font-size: 12px;
    align-items: center;
    justify-content: center;
  `;

  export const Footer = styled.div<{ color: string }>`
    padding: 5px;
    font-family: 'Open Sans';
    font-size: 12px;
    color: ${(p) => p.color};
  `;

  export const MetaKey = styled.div`
    opacity: 0.5;
    padding-right: 5px;
  `;

  export const MetaValue = styled.div`
    white-space: nowrap;
  `;

  const ALIGNMENT = {
    [AtomImageAlignment.LEFT]: 'flex-start',
    [AtomImageAlignment.RIGHT]: 'flex-end',
    [AtomImageAlignment.CENTER]: 'center'
  };

  export const SmartPorts = styled(SmartPortsWidget)``;

  export const ImageContainer = styled.div<{ alignment: AtomImageAlignment }>`
    display: flex;
    justify-content: ${(p) => ALIGNMENT[p.alignment]};
  `;

  export const Image = styled.img<{ height?: number; width?: number }>`
    ${(p) => (p.height ? `height: ${p.height}px` : '')};
    ${(p) => (p.width ? `height: ${p.width}px` : '')};
    pointer-events: none;
  `;

  export const Container = styled.div`
    display: flex;
    justify-content: space-between;
    padding-top: 5px;
    padding-bottom: 5px;
  `;
}
