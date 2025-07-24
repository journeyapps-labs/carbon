import * as React from 'react';
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { ToolbarWidget } from './ToolbarWidget';
import {
  CarbonStormEngine,
  CarbonThemeContainerWidget,
  DebugStormCarbonCanvasWidget,
  StormCarbonCanvasWidget,
  useForceUpdate
} from '@journeyapps-labs/carbon-ui-storm';
import { createMolecule } from '../fixtures/complex-molecule';
import { BuiltInThemes } from '@journeyapps-labs/carbon-ui';
import { BaseProgram, Program } from '@journeyapps-labs/carbon-core';
import { generateEngine } from './ui';
import { CARBON_DARK, CARBON_DARK_NEON, CARBON_LIGHT } from '@journeyapps-labs/carbon-ui';

export const CanvasSelector: React.FC<React.PropsWithChildren<{ program: BaseProgram; className?: any }>> = (props) => {
  if (props.program) {
    return (
      <DebugStormCarbonCanvasWidget className={props.className} program={props.program}>
        {props.children}
      </DebugStormCarbonCanvasWidget>
    );
  }
  return <div className={props.className}>{props.children}</div>;
};

export interface SmartEditorProps {
  carbonTheme: BuiltInThemes;
  className?: any;
}

export const SmartEditor: React.FC<SmartEditorProps> = (props) => {
  const [molecule] = useState(() => {
    return createMolecule();
  });
  const forceUpdate = useForceUpdate();

  const [engine] = useState<CarbonStormEngine>(() => {
    const engine = generateEngine();
    engine.registerListener({
      programChanged: () => {
        forceUpdate();
      }
    });
    return engine;
  });
  useEffect(() => {
    engine.setTheme(
      {
        [BuiltInThemes.DARK]: CARBON_DARK,
        [BuiltInThemes.CYBER]: CARBON_DARK_NEON,
        [BuiltInThemes.LIGHT]: CARBON_LIGHT
      }[props.carbonTheme]
    );
    engine.reDistribute();
    setTimeout(() => {
      engine.reDistribute();
    }, 10);
  }, [props.carbonTheme]);

  return (
    <CarbonThemeContainerWidget engine={engine}>
      <S.Container className={props.className}>
        <S.Toolbar
          items={[
            {
              label: 'Compile',
              action: () => {
                let program = new Program(molecule.molecule);
                program.compile();
                engine.setProgram(program);
              }
            },
            {
              label: 'Run',
              action: () => {
                (engine.program as Program).run();
              }
            }
          ]}
        />
        <S.CanvasContainer program={engine.program}>
          <StormCarbonCanvasWidget engine={engine} molecule={molecule.molecule} />
        </S.CanvasContainer>
      </S.Container>
    </CarbonThemeContainerWidget>
  );
};

namespace S {
  export const Container = styled.div`
    display: flex;
    position: absolute;
    flex-direction: column;
  `;

  export const Toolbar = styled(ToolbarWidget)`
    flex-shrink: 0;
  `;

  export const CanvasContainer = styled(CanvasSelector)`
    flex-grow: 1;
  `;
}
