import 'express';

declare module 'express' {
  export interface Request {
    ip: string;
  }
}
