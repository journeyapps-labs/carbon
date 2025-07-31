import {
  EnumProperty,
  JoinAtom,
  JoinAtomFactory,
  JoinAtomProperties,
  JoinAtomType,
  ParamAtomFactory,
  OutputAtomFactory,
  ProgramEndFactory,
  ProgramStartFactory
} from '@journeyapps-labs/carbon-core';
import * as _ from 'lodash';
import { BuiltInThemes } from './theme/CarbonTheme';
import { AtomUIBank } from './ui/AtomUIBank';
import { AtomBadgeAlignment, AtomImageAlignment } from './ui/AtomUI';

const lightDarkSelector = (base: BuiltInThemes) => {
  if (base === BuiltInThemes.LIGHT) {
    return '#ffffff';
  }
  return '#000000';
};

export const generateAtomUIBank = _.memoize(() => {
  const bank = new AtomUIBank();

  // Program start
  bank.registerUI({
    type: ProgramStartFactory.TYPE,
    color: lightDarkSelector,
    image: {
      src: require('../media/start.svg'),
      height: 20,
      alignment: AtomImageAlignment.RIGHT
    }
  });

  // Program end
  bank.registerUI({
    type: ProgramEndFactory.TYPE,
    color: lightDarkSelector,
    image: {
      src: require('../media/end.svg'),
      height: 20,
      alignment: AtomImageAlignment.LEFT
    }
  });

  bank.registerUI({
    type: ParamAtomFactory.TYPE,
    color: lightDarkSelector,
    badge: {
      position: AtomBadgeAlignment.TL,
      src: require('../media/param-in.svg')
    }
  });

  bank.registerUI({
    type: OutputAtomFactory.TYPE,
    color: lightDarkSelector,
    badge: {
      position: AtomBadgeAlignment.TR,
      src: require('../media/param-out.svg')
    }
  });

  // join atom
  bank.registerUI({
    type: JoinAtomFactory.TYPE,
    color: lightDarkSelector,
    meta: {
      Wait: (atom: JoinAtom) => {
        return (atom.properties.get(JoinAtomProperties.JOIN_TYPE) as EnumProperty<JoinAtomType>).valueLabel;
      }
    }
  });

  return bank;
});
