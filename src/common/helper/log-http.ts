/* -------------------------------------------------------------------------- */
/*                                  Error Log                                 */
/* -------------------------------------------------------------------------- */

export interface IErrorLog {
    level: 'error';
    date: string;
    message: string;
    statusCode: string;
  
    body: object;
    params: object;
    method: string;
    query: object;
    url: string;
  }
  
  export const createErrorLog = ({
    statusCode,
    message,
    body,
    params,
    method,
    query,
    url,
  }: {
    message: string;
    statusCode: string;
  
    body: object;
    params: object;
    method: string;
    query: object;
    url: string;
  }): IErrorLog => {
    return {
      level: 'error',
      date: new Date().toISOString(),
      message,
      statusCode,
  
      body: body,
      params: params,
      method: method,
      query: query,
      url: url,
    };
  };
  