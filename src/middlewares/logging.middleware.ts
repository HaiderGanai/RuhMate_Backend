import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger("Response");

  use(req: Request, res: Response, next: NextFunction) {
  const { method, originalUrl: url, body, query } = req;
  const reqTime = Date.now();

  const originalSend = res.send;
  let responseBody: any;

  res.send = function (body: any) {
    responseBody = body;
    return originalSend.call(this, body);
  };

  res.on("finish", () => {
    const { statusCode } = res;
    const resTime = Date.now();
    const responseTime = resTime - reqTime;

    let message = `${method} ${url} ${statusCode} - ${responseTime} ms`;

    if (statusCode >= 400) {
      // Add request details for debugging
      if (Object.keys(query).length > 0) {
        message += ` | Query: ${JSON.stringify(query)}`;
      }
      if (body && Object.keys(body).length > 0) {
        message += ` | Body: ${JSON.stringify(body)}`;
      }
      
      // Add error response
      if (responseBody) {
        try {
          const parsedBody = typeof responseBody === 'string' 
            ? JSON.parse(responseBody) 
            : responseBody;
          const errorDetails = parsedBody.message || parsedBody.error;
          if (errorDetails) {
            message += ` | Error: ${errorDetails}`;
          }
        } catch (e) {}
      }
    }
    
    if (statusCode >= 500) {
      this.logger.error(message); 
    } else if (statusCode >= 400) {
      this.logger.warn(message); 
    } else {
      this.logger.log(message);
    }
  });

  next();
}
}