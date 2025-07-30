import { CarbonParseError } from '../CarbonParseError';
import { XMLNode } from '@journeyapps/domparser';

export class CarbonXMLParseError extends CarbonParseError {
  constructor(
    public element: XMLNode,
    error: string
  ) {
    super(error);
  }
}
