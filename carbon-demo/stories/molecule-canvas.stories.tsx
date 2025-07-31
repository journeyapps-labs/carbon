import * as React from 'react';
import { useEffect } from 'react';
import { CarbonThemeContainerWidget, StormCarbonCanvasWidget } from '@journeyapps-labs/carbon-ui-storm';
import styled from '@emotion/styled';
import { createMolecule } from './fixtures/complex-molecule';
import { generateEngine } from './src/ui';
import { CARBON_DARK_ELEMENTS } from '@journeyapps-labs/carbon-elements-ui';

const Canvas = styled(StormCarbonCanvasWidget)`
  position: absolute;
`;

const engine = generateEngine();
const { molecule } = createMolecule();

const Comp = () => {
  useEffect(() => {
    engine.setTheme(CARBON_DARK_ELEMENTS);
    setTimeout(() => {
      engine.reDistribute();
    }, 100);
  }, []);

  return (
    <CarbonThemeContainerWidget engine={engine}>
      <Canvas engine={engine} molecule={molecule} />
    </CarbonThemeContainerWidget>
  );
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  component: Comp
};

export default meta;
export const Primary = {};
