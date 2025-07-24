import * as React from 'react';
import { PortWidget, PortWidgetProps, useCarbonTheme } from '@journeyapps-labs/carbon-ui-storm';

export interface TextPortWidgetProps extends Omit<PortWidgetProps, 'icon' | 'iconColor' | 'color' | 'iconSize'> {}

export const TextPortWidget: React.FC<TextPortWidgetProps> = (props) => {
  const theme = useCarbonTheme();
  return (
    <PortWidget
      {...props}
      color={theme.types.text.color}
      iconColor={theme.types.text.icon}
      iconSize={12}
      icon={{
        fa: 'font'
      }}
    />
  );
};
