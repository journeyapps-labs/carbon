import { PortWidget, PortWidgetProps, useCarbonTheme } from '@journeyapps-labs/carbon-ui-storm';
import * as React from 'react';

export interface DatePortWidgetProps extends Omit<PortWidgetProps, 'icon' | 'iconColor' | 'color' | 'iconSize'> {}

export const DatePortWidget: React.FC<DatePortWidgetProps> = (props) => {
  const theme = useCarbonTheme();
  return (
    <PortWidget
      {...props}
      color={theme.types.date.color}
      iconColor={theme.types.date.icon}
      iconSize={12}
      icon={{
        fa: 'clock'
      }}
    />
  );
};
