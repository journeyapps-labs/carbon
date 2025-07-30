import { Atom } from '@journeyapps-labs/carbon-core';
import { BuiltInThemes } from '../theme/CarbonTheme';

export enum AtomImageAlignment {
  CENTER = 'center',
  LEFT = 'left',
  RIGHT = 'right'
}

export enum AtomBadgeAlignment {
  TR = 'tr',
  TL = 'tl'
}

export type ColorResolver = string | ((theme: BuiltInThemes) => string);

export interface AtomUI<T extends Atom = Atom> {
  type: string;
  color: ColorResolver;
  meta?: {
    [key: string]: (atom: T) => string;
  };
  footer?: (atom: T) => string;
  title?: {
    label?: (atom: T) => string;
    action?: (atom: T) => any;
  };
  badge?: {
    position: AtomBadgeAlignment;
    src: string;
    extraPadding?: number;
  };
  tooltip?: string;
  image?: {
    src: string;
    width?: number;
    height?: number;
    alignment?: AtomImageAlignment;
  };
}
