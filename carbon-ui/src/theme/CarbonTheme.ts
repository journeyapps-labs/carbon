import { ProgramStatus } from '@journeyapps-labs/carbon-core';

export interface PortTheme {
  color: string;
  icon: string;
}

export enum BuiltInThemes {
  DARK = 'Dark',
  CYBER = 'Cyber',
  LIGHT = 'Light'
}

export interface CarbonTheme {
  base: BuiltInThemes;
  types: {
    flow: PortTheme;
    placeholder: PortTheme;
    [key: string]: PortTheme;
  };
  textAnnotationColor: string;
  interactions: {
    selected: string;
  };
  genericNode: {
    borderRadius: number;
    borderColor: string;
    background: string;
    titleBackground: string;
    titleForeground: string;
    portLabelBackground: string;
    portLabelForeground: string;
    metaColor: string;
  };
  status: {
    [ProgramStatus.RUNNING]: string;
    [ProgramStatus.ERROR]: string;
    [ProgramStatus.STOPPED]: string;
  };
}

export const CARBON_DARK: CarbonTheme = {
  base: BuiltInThemes.DARK,
  textAnnotationColor: '#fff',
  types: {
    flow: {
      icon: '#000000',
      color: 'rgb(0,192,255)'
    },
    placeholder: {
      color: '#ff0000',
      icon: '#fff'
    }
  },
  genericNode: {
    borderRadius: 10,
    background: '#1f1f1f',
    borderColor: '#000',
    titleBackground: '#000',
    titleForeground: '#fff',
    portLabelBackground: 'rgba(0, 0, 0, 0.3)',
    portLabelForeground: 'rgba(255, 255, 255, 0.4)',
    metaColor: '#fff'
  },
  interactions: {
    selected: 'rgb(0,192,255)'
  },
  status: {
    [ProgramStatus.ERROR]: 'red',
    [ProgramStatus.RUNNING]: 'rgb(192,255,0)',
    [ProgramStatus.STOPPED]: 'orange'
  }
};

export const CARBON_DARK_NEON: CarbonTheme = {
  base: BuiltInThemes.CYBER,
  textAnnotationColor: '#fff',
  types: {
    flow: {
      icon: 'white',
      color: 'rgb(255,0,254)'
    },
    placeholder: {
      color: '#ff0000',
      icon: '#fff'
    }
  },
  genericNode: {
    borderRadius: 10,
    background: '#1f1f1f',
    borderColor: '#448811',
    titleBackground: '#000',
    titleForeground: '#fff',
    portLabelBackground: 'rgba(0, 0, 0, 0.3)',
    portLabelForeground: 'rgba(255, 255, 255, 0.4)',
    metaColor: '#fff'
  },
  interactions: {
    selected: 'rgb(0,192,255)'
  },
  status: {
    [ProgramStatus.ERROR]: 'red',
    [ProgramStatus.RUNNING]: 'rgb(192,255,0)',
    [ProgramStatus.STOPPED]: 'orange'
  }
};

export const CARBON_LIGHT: CarbonTheme = {
  base: BuiltInThemes.LIGHT,
  textAnnotationColor: '#000',
  types: {
    flow: {
      icon: '#ffffff',
      color: '#000000'
    },
    placeholder: {
      color: '#ff0000',
      icon: '#fff'
    }
  },
  genericNode: {
    borderRadius: 6,
    background: '#eeeeee',
    borderColor: '#b6b6b6',
    titleBackground: 'rgba(0,0,0,0.15)',
    titleForeground: '#000',
    portLabelBackground: 'rgba(168,168,168,0.3)',
    portLabelForeground: '#000',
    metaColor: '#000'
  },
  interactions: {
    selected: 'rgb(0,192,255)'
  },
  status: {
    [ProgramStatus.ERROR]: 'red',
    [ProgramStatus.RUNNING]: 'rgb(192,255,0)',
    [ProgramStatus.STOPPED]: 'orange'
  }
};

export const BUILT_IN_THEMES = {
  [BuiltInThemes.DARK]: CARBON_DARK,
  [BuiltInThemes.CYBER]: CARBON_DARK_NEON,
  [BuiltInThemes.LIGHT]: CARBON_LIGHT
};
