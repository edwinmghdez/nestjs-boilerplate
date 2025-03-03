import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter
{
  private readonly logger = new Logger(CustomExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      message = typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse as any).message || message;
    }

    this.logger.error(`Error: ${message}`, exception instanceof Error ? exception.stack : '');

    return response.status(status).json({
      status: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
