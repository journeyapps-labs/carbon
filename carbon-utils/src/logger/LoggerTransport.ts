import { LogLevel } from './Logger';

export abstract class LoggerTransport {
  abstract log(level: LogLevel, name: string, d: any[]);
}
