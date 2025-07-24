import { LoggerTransport } from './LoggerTransport';
import { LogLevel } from './Logger';

export class ConsoleLoggerTransport extends LoggerTransport {
  log(level: LogLevel, name: string, d: any[]) {
    let payload = [`[${name}]`, ...d];
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
