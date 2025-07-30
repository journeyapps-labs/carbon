import { CARBON_DARK, CARBON_LIGHT, CARBON_DARK_NEON, CarbonTheme, PortTheme } from '@journeyapps-labs/carbon-ui';
import { ValueType } from '@journeyapps-labs/carbon-elements';

export type Patch = {
  [key in ValueType]: PortTheme;
};

export type ElementsCarbonTheme = CarbonTheme & {
  types: {
    [ValueType.BOOLEAN]: PortTheme;
    [ValueType.NUMBER]: PortTheme;
    [ValueType.TEXT]: PortTheme;
    [ValueType.DATE]: PortTheme;
    [ValueType.ARRAY]: PortTheme;
  };
};

export const patchTheme = (theme: CarbonTheme, patch: Patch): ElementsCarbonTheme => {
  return {
    ...theme,
    types: {
      ...theme.types,
      ...patch
    }
  };
};

export const CARBON_DARK_ELEMENTS = patchTheme(CARBON_DARK, {
  number: {
    color: '#ff6600',
    icon: '#ffffff'
  },
  boolean: {
    color: '#e31137',
    icon: '#ffffff'
  },
  date: {
    color: 'rgb(134,176,0)',
    icon: '#000000'
  },
  text: {
    color: '#ffea00',
    icon: '#000'
  },
  array: {
    color: '#fff',
    icon: '#000'
  }
});

export const CARBON_LIGHT_ELEMENTS = patchTheme(CARBON_LIGHT, {
  number: {
    color: '#ff501b',
    icon: '#000'
  },
  boolean: {
    color: '#ff3f62',
    icon: '#ffffff'
  },
  date: {
    color: 'rgb(119,192,39)',
    icon: '#000000'
  },
  text: {
    color: '#F3C13A',
    icon: '#000'
  },
  array: {
    color: '#fff',
    icon: '#000'
  }
});

export const CARBON_CYBER_ELEMENTS = patchTheme(CARBON_DARK_NEON, {
  number: {
    color: 'cyan',
    icon: '#001f5d'
  },
  date: {
    color: 'rgb(192,255,0)',
    icon: '#ffffff'
  },
  boolean: {
    color: '#ff0000',
    icon: '#ffffff'
  },
  text: {
    color: 'cyan',
    icon: '#001f5d'
  },
  array: {
    color: '#fff',
    icon: '#000'
  }
});
