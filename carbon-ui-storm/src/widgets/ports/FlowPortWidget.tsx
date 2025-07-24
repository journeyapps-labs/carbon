import * as React from 'react';
import { PortWidget, PortWidgetProps } from './PortWidget';
import { useCarbonTheme } from '../../themed';

export interface FlowPortWidgetProps extends Omit<PortWidgetProps, 'icon' | 'iconColor' | 'color'> {}

export const FlowPortWidget: React.FC<FlowPortWidgetProps> = (props) => {
  const theme = useCarbonTheme();
  return (
    <PortWidget
      {...props}
      color={theme.types.flow.color}
      iconColor={theme.types.flow.icon}
      iconSize={14}
      icon={{
        fa: 'arrow-right'
      }}
    />
  );
};
