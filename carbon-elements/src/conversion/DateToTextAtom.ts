import { AbstractConversionAtom, ConversionExecutorAtom } from './AbstractConversionAtom';
import { AtomFactory, CarbonPortOptions, ExecutorAtom } from '@journeyapps-labs/carbon-core';
import { TextPort } from '../types/TextPort';
import { ElementCategories } from '../types';
import { DatePort } from '../types/DatePort';

export class DateToTextAtomFactory extends AtomFactory<DateToTextAtom> {
  static TYPE = 'date-to-text';

  constructor() {
    super({
      type: DateToTextAtomFactory.TYPE,
      label: 'Date to text',
      category: ElementCategories.CONVERSION
    });
  }

  generateAtom(): DateToTextAtom {
    return new DateToTextAtom();
  }
}

export class DateToTextAtom extends AbstractConversionAtom {
  constructor() {
    super(DateToTextAtomFactory.TYPE);
  }

  protected _generateExecutorAtom(): ExecutorAtom {
    return new ConversionExecutorAtom<Date, string>(this, (value) => {
      return `${value.toISOString()}`;
    });
  }

  generatePortIn(port: CarbonPortOptions) {
    return new DatePort(port);
  }

  generatePortOut(port: CarbonPortOptions) {
    return new TextPort(port);
  }
}
