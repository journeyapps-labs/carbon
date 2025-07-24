import { PortWidget, PortWidgetProps, useCarbonTheme } from '@journeyapps-labs/carbon-ui-storm';
import * as React from 'react';
import { ValueType } from '@journeyapps-labs/carbon-elements';

export interface NumberPortWidgetProps extends Omit<PortWidgetProps, 'icon' | 'iconColor' | 'color' | 'iconSize'> {}

export const NumberPortWidget: React.FC<NumberPortWidgetProps> = (props) => {
  const theme = useCarbonTheme();
  return (
    <PortWidget
      {...props}
      color={theme.types[ValueType.NUMBER].color}
      iconColor={theme.types[ValueType.NUMBER].icon}
      iconSize={12}
      icon={{
        fa: 'calculator'
      }}
    />
  );
};
