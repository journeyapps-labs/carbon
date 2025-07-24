import * as React from 'react';
import styled from '@emotion/styled';
import { BuiltInThemes } from '@journeyapps-labs/carbon-ui';
import { SmartEditor } from './src/SmartEditor';

namespace S {
  export const Canvas = styled(SmartEditor)`
    position: absolute;
    height: 100%;
    width: 100%;
  `;
}

export const Debug = ({ theme }) => {
  return <S.Canvas carbonTheme={theme} />;
};

Debug.args = {
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
