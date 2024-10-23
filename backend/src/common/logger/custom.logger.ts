import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class CustomLogger implements LoggerService {
  log(message: string) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[LOG] ${message}`);
    }
  }

  error(message: string, trace: string) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[ERROR] ${message} - Trace: ${trace}`);
    }
  }

  warn(message: string) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[WARN] ${message}`);
    }
  }

  debug(message: string) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${message}`);
    }
  }

  verbose(message: string) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[VERBOSE] ${message}`);
    }
  }
}
