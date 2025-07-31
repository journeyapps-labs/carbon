import * as React from 'react';
import styled from '@emotion/styled';
import { BuiltInThemes } from '@journeyapps-labs/carbon-ui';
import { SmartEditor } from './src/SmartEditor';

const Canvas = styled(SmartEditor)`
  position: absolute;
  height: 100%;
  width: 100%;
`;

const Debug = () => {
  return <Canvas carbonTheme={BuiltInThemes.CYBER} />;
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  component: Debug
};

export default meta;

export const Primary = {};
