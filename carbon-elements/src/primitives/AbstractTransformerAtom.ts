import { Atom, AtomPortType, CarbonPortOptions, ExecutorAtom } from '@journeyapps-labs/carbon-core';
import { ValueType } from '../types';
import { ValueTransformerAtomExecutor } from './ValueTransformerAtomExecutor';

export class AbstractTransformerExecutorAtom<T> extends ValueTransformerAtomExecutor<
  Array<T>,
  T,
  AbstractTransformerAtom
> {}

export interface AbstractTransformerAtomOptions<T extends any = any> {
  type: string;
  inputs: number;
  transform: (values: T[]) => T;
  label: string;
}

export abstract class AbstractTransformerAtom<T extends any = any> extends Atom {
  constructor(
    public valueType: ValueType,
    public options: AbstractTransformerAtomOptions<T>
  ) {
    super(options.type);
    this.addPort(
      this.generatePort({
        type: AtomPortType.OUT,
        key: 'out'
      })
    );
    for (let i = 0; i < options.inputs; i++) {
      this.addPort(
        this.generatePort({
          type: AtomPortType.IN,
          key: `in-${i + 1}`
        })
      );
    }
    this.label = options.label;
  }

  abstract generatePort(port: CarbonPortOptions);

  protected _generateExecutorAtom(): ExecutorAtom {
    return new AbstractTransformerExecutorAtom<T>(this, this.options.transform);
  }
}
