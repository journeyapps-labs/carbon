import * as React from 'react';
import { useEffect } from 'react';
import { CarbonThemeContainerWidget, StormCarbonCanvasWidget } from '@journeyapps-labs/carbon-ui-storm';
import styled from '@emotion/styled';
import { createMolecule } from './fixtures/complex-molecule';
import { BuiltInThemes, CARBON_DARK, CARBON_DARK_NEON } from '@journeyapps-labs/carbon-ui';
import { generateEngine } from './src/ui';
import { CARBON_CYBER_ELEMENTS, CARBON_DARK_ELEMENTS } from '@journeyapps-labs/carbon-elements-ui';

namespace S {
  export const Canvas = styled(StormCarbonCanvasWidget)`
    position: absolute;
  `;
}

const engine = generateEngine();

const { molecule } = createMolecule();

export const Comp = ({ theme }) => {
  useEffect(() => {
    engine.setTheme(
      {
        Dark: CARBON_DARK_ELEMENTS,
        Cyber: CARBON_CYBER_ELEMENTS
      }[theme]
    );
    setTimeout(() => {
      engine.reDistribute();
    }, 100);
  }, [theme]);

  return (
    <CarbonThemeContainerWidget engine={engine}>
      <S.Canvas engine={engine} molecule={molecule} />
    </CarbonThemeContainerWidget>
  );
};

Comp.args = {
  theme: BuiltInThemes.DARK
};

export default {
  title: 'Program',
  argTypes: {
    theme: {
      options: Object.values(BuiltInThemes),
      control: { type: 'select' }
    }
  },
  parameters: {
    layout: 'fullscreen'
  }
};
