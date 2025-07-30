import * as React from 'react';
import { PortWidget, PortWidgetProps } from './PortWidget';

export interface NumberPortWidgetProps extends Omit<PortWidgetProps, 'icon' | 'iconColor'> {}

export const CustomPortWidget: React.FC<NumberPortWidgetProps> = (props) => {
  return (
    <PortWidget
      {...props}
      color="#8a50ff"
      iconColor="#bf9fff"
      icon={{
        fa: 'cube'
      }}
    />
  );
};
