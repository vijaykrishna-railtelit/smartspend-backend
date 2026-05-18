import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = this.resolveMessage(exception);

    if (status >= 500) {
      this.logger.error(
        `${req.method} ${req.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    res.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req.url,
      message,
    });
  }

  private resolveMessage(exception: unknown): string {
    if (!(exception instanceof HttpException)) return 'Internal server error';

    const response: string | object = exception.getResponse();

    if (typeof response === 'string') return response;

    if (
      typeof response === 'object' &&
      response !== null &&
      'message' in response
    ) {
      const msg = (response as Record<string, unknown>).message;
      if (Array.isArray(msg)) return msg.map(String).join(', ');
      return String(msg);
    }

    return exception.message;
  }
}
