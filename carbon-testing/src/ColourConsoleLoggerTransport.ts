import { LoggerTransport, LogLevel } from '@journeyapps-labs/common-logger';
import colors from 'colors/safe';
import * as _ from 'lodash';

export enum PrimaryConsoleColours {
  GREEN = 'green',
  CYAN = 'cyan'
}

export class ColourConsoleLoggerTransport extends LoggerTransport {
  constructor(protected primaryColor: PrimaryConsoleColours = PrimaryConsoleColours.GREEN) {
    super();
  }

  getLevel = _.memoize((level: LogLevel) => {
    if (level === LogLevel.ERROR) {
      return colors.red(level);
    } else if (level === LogLevel.WARN) {
      return colors.yellow(level);
    } else if (level === LogLevel.DEBUG) {
      return colors.blue(level);
    }
    return level;
  });

  getName(name: string) {
    if (this.primaryColor === PrimaryConsoleColours.GREEN) {
      return colors.green(name);
    }
    return colors.cyan(name);
  }

  log(level: LogLevel, name: string, d: any[]) {
    let payload = [`[${this.getLevel(level)}]`, `[${this.getName(name)}]`, ...d];
    if (level === LogLevel.DEBUG) {
      console.debug(...payload);
    } else if (level === LogLevel.ERROR) {
      console.error(...payload);
    } else if (level === LogLevel.WARN) {
      console.warn(...payload);
    } else {
      console.log(...payload);
    }
  }
}
