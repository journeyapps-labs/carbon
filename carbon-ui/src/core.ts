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

const program_start = require('../media/start.svg');
const program_end = require('../media/end.svg');
const param_in = require('../media/param-in.svg');
const param_out = require('../media/param-out.svg');

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
      src: program_start,
      height: 20,
      alignment: AtomImageAlignment.RIGHT
    }
  });

  // Program end
  bank.registerUI({
    type: ProgramEndFactory.TYPE,
    color: lightDarkSelector,
    image: {
      src: program_end,
      height: 20,
      alignment: AtomImageAlignment.LEFT
    }
  });

  bank.registerUI({
    type: ParamAtomFactory.TYPE,
    color: lightDarkSelector,
    badge: {
      position: AtomBadgeAlignment.TL,
      src: param_in
    }
  });

  bank.registerUI({
    type: OutputAtomFactory.TYPE,
    color: lightDarkSelector,
    badge: {
      position: AtomBadgeAlignment.TR,
      src: param_out
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
