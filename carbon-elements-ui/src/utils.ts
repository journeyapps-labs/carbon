import { CarbonTheme, PortTheme } from '@journeyapps-labs/carbon-ui';
import { ValueType } from '@journeyapps-labs/carbon-elements';

export const getTypeTheme = (theme: CarbonTheme, type: ValueType): PortTheme => {
  return (
    theme.types[type] || {
      color: 'white',
      icon: 'black'
    }
  );
};
