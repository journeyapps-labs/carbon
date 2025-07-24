import * as React from 'react';
import { PortWidget, PortWidgetProps, useCarbonTheme } from '@journeyapps-labs/carbon-ui-storm';
import { ValueType } from '@journeyapps-labs/carbon-elements';

export interface BooleanPortWidgetProps extends Omit<PortWidgetProps, 'icon' | 'iconColor' | 'color' | 'iconSize'> {}

export const BooleanPortWidget: React.FC<BooleanPortWidgetProps> = (props) => {
  const theme = useCarbonTheme();
  return (
    <PortWidget
      {...props}
      color={theme.types[ValueType.BOOLEAN].color}
      iconColor={theme.types[ValueType.BOOLEAN].icon}
      iconSize={12}
      icon={{
        fa: 'check'
      }}
    />
  );
};
