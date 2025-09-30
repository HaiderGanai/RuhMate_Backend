import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger("Response");

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl: url } = req;
    const reqTime = Date.now();

    res.on("finish", () => {
      const { statusCode } = res;
      const resTime = Date.now();
      const responseTime = resTime - reqTime;

      const message = `${method} ${url} ${statusCode} - ${responseTime} ms`;

      if (statusCode >= 500) {
        this.logger.error(message); // server errors
      } else if (statusCode >= 400) {
        this.logger.warn(message); // client errors
      } else {
        this.logger.log(message); // success
      }
    });

    next();
  }
}
