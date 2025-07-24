import * as React from 'react';
import { useEffect } from 'react';
import { ThemeProvider } from '@emotion/react';
import { CarbonStormEngine } from './CarbonStormEngine';
import { useForceUpdate } from './hooks/useForceUpdate';

export interface CarbonThemeContainerWidgetProps {
  engine: CarbonStormEngine;
}

export const CarbonThemeContainerWidget: React.FC<React.PropsWithChildren<CarbonThemeContainerWidgetProps>> = (
  props
) => {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    return props.engine.registerListener({
      themeChanged: () => {
        forceUpdate();
        props.engine.diagramEngine?.repaintCanvas();
      }
    });
  }, [props.engine]);

  return <ThemeProvider theme={props.engine.theme}>{props.children}</ThemeProvider>;
};
