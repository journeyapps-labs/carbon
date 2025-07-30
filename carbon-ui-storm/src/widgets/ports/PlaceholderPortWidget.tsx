import * as React from 'react';
import { PortWidget, PortWidgetProps } from './PortWidget';
import { useCarbonTheme } from '../../themed';

export interface PlaceholderPortWidgetProps extends Omit<PortWidgetProps, 'icon' | 'iconColor' | 'color'> {}

export const PlaceholderPortWidget: React.FC<PlaceholderPortWidgetProps> = (props) => {
  const theme = useCarbonTheme();
  return (
    <PortWidget
      {...props}
      color={theme.types.placeholder.color}
      iconColor={theme.types.placeholder.icon}
      iconSize={14}
      icon={{
        fa: 'ban'
      }}
    />
  );
};
