import { PortFactory } from '@journeyapps-labs/carbon-core';
import { BooleanPortType } from './BooleanPort';
import { DatePortType } from './DatePort';
import { TextPortType } from './TextPort';
import { NumberPortType } from './NumericPort';

export enum ValueType {
  NUMBER = 'number',
  TEXT = 'text',
  BOOLEAN = 'boolean',
  DATE = 'date',
  ARRAY = 'array'
}

export enum ElementCategories {
  TEXT = 'Text',
  MATH = 'Math',
  BOOLEAN = 'Boolean',
  CORE = 'Core',
  CONVERSION = 'Conversion',
  DATE = 'Date'
}

export const setupPortFactory = (factory: PortFactory) => {
  factory.registerType(new BooleanPortType());
  factory.registerType(new DatePortType());
  factory.registerType(new NumberPortType());
  factory.registerType(new TextPortType());
};
