import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as JSONAPISerializer from 'json-api-serializer';

// tslint:disable-next-line:variable-name
const Serializer = new JSONAPISerializer();

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const request = ctx.getRequest();
    const { url } = request;

    const status =
      exception instanceof HttpException
        ? +exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const stack = !exception.stack ? null : exception.stack;
    console.warn('\x1b[31m', stack, 'stack');

    const errorCode = (exception as any)?.response?.error || undefined;

    const errorMessage: any =
      (exception as any)?.response?.message || exception?.message || exception;

    let errorDefault: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: url,
      code: errorCode,
      message: errorMessage,
    };

    if (typeof errorMessage === 'object' && errorMessage.length) {
      const error = errorMessage.map((message) => ({
        ...errorDefault,
        message,
      }));

      errorDefault = error;
    }

    response.status(status).json(Serializer.serializeError(errorDefault));
  }
}
