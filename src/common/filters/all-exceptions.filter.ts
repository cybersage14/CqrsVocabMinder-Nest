import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Inject
  } from '@nestjs/common';
  import { HttpAdapterHost } from '@nestjs/core';
  import { JwtService } from '@nestjs/jwt';
  import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
  import { Logger } from 'winston';
  
  import { INTERNAL_SERVER_ERROR } from '../errors';
import { createErrorLog } from '../helper';
  
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    constructor(
      private jwtService: JwtService,
      @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
      private readonly httpAdapterHost: HttpAdapterHost,
    ) {}
  
    catch(exception: unknown, host: ArgumentsHost): void {
      const { httpAdapter } = this.httpAdapterHost;
      const ctx = host.switchToHttp();
  
      /* -------------------------------------------------------------------------- */
      /*                               Http Status                                  */
      /* -------------------------------------------------------------------------- */
  
      const httpStatus =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
  
      /* -------------------------------------------------------------------------- */
      /*                           Creating Error Message                           */
      /* -------------------------------------------------------------------------- */
  
      let message = exception;
      if (exception instanceof BadRequestException) {
        message = exception.getResponse()['message'];
      } else if (exception instanceof HttpException) {
        message = exception.message;
      } else {
        message = exception;
      }
  
      /* -------------------------------------------------------------------------- */
      /*                             Creating Error Log                             */
      /* -------------------------------------------------------------------------- */

      const { body, params, method, query, url } = ctx.getRequest();
  
      this.logger.log(
        createErrorLog({
          statusCode: `${httpStatus}`,
          message: `${message}`,
          body,
          params,
          method,
          query,
          url,
        }),
      );
  
      /* -------------------------------------------------------------------------- */
      /*                              Responding Error                              */
      /* -------------------------------------------------------------------------- */
  
      const responseBody = {
        statusCode: httpStatus,
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
        message:
          httpStatus === 500 && process.env?.NODE_ENV === 'production'
            ? INTERNAL_SERVER_ERROR.description
            : message,
      };
  
      httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
  }
  