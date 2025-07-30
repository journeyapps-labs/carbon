import * as _ from 'lodash';
import { PortFactory } from './core/basic/PortFactory';
import { ParamAtomFactory } from './elements/ParamAtom';
import { ProgramStartFactory } from './elements/ProgramStartAtom';
import { ForkAtomFactory } from './elements/ForkAtom';
import { ProgramEndFactory } from './elements/ProgramEndAtom';
import { JoinAtomFactory } from './elements/JoinAtom';
import { OutputAtomFactory } from './elements/OutputAtom';
import { SetVariableAtomFactory } from './elements/SetVariableAtom';
import { GetVariableAtomFactory } from './elements/GetVariableAtom';
import { TextAnnotationElementFactory } from './elements/annotation/TextAnnotationElement';

export const generateFactories = _.memoize((portFactory: PortFactory, defaultType: string) => {
  return [
    // core
    new ParamAtomFactory({
      defaultType: defaultType,
      portFactory: portFactory
    }),
    new OutputAtomFactory({
      defaultType: defaultType,
      portFactory: portFactory
    }),
    new SetVariableAtomFactory({
      defaultType: defaultType,
      portFactory: portFactory
    }),
    new GetVariableAtomFactory({
      portFactory: portFactory
    }),
    new ProgramStartFactory(),
    new ProgramEndFactory(),
    new ForkAtomFactory(),
    new JoinAtomFactory(),
    new TextAnnotationElementFactory()
  ];
});
