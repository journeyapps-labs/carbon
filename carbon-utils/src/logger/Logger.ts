import { LoggerTransport } from './LoggerTransport';
import { ConsoleLoggerTransport } from './ConsoleLoggerTransport';
import * as _ from 'lodash';

export enum LogLevel {
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
  WARN = 'WARN',
  INFO = 'INFO'
}

export interface LoggerOptions {
  name: string;
  level?: LogLevel;
  transport?: LoggerTransport;
}

export class Logger {
  protected transport: LoggerTransport;

  constructor(private options: LoggerOptions) {
    this.options = {
      ...options,
      level: options.level || LogLevel.WARN
    };
    if (options.transport) {
      this.setTransport(options.transport);
    } else {
      this.setTransport(new ConsoleLoggerTransport());
    }
  }

  setTransport(transport: LoggerTransport) {
    this.transport = transport;
  }

  get name() {
    return this.options.name;
  }

  private allowedToLog = _.memoize((level: LogLevel) => {
    const logLevels = Object.values(LogLevel);
    return logLevels.indexOf(this.options.level) <= logLevels.indexOf(level);
  });

  log(level: LogLevel, args: any[]) {
    if (!this.allowedToLog(level)) {
      return;
    }
    this.transport.log(level, this.name, args);
  }

  debug(...args: any) {
    this.log(LogLevel.DEBUG, args);
  }

  info(...args: any) {
    this.log(LogLevel.INFO, args);
  }

  error(...args: any) {
    this.log(LogLevel.ERROR, args);
  }

  warn(...args: any) {
    this.log(LogLevel.WARN, args);
  }

  createLogger(subName: string): Logger {
    return new Logger({
      name: `${this.name}:${subName}`,
      transport: this.transport,
      level: this.options.level
    });
  }
}
