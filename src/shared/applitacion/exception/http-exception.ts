declare type allKeys<T> = T extends any ? keyof T : never;

interface ZodFlatError<T, U = string> {
  formErrors: U[];
  fieldErrors: { [P in allKeys<T>]?: U[] | undefined };
}
class HttpException extends Error {
  statusCode?: number;
  status?: string;
  message: string;
  errors?: ZodFlatError<any, string> | string | undefined;

  constructor(
    statusCode: number,
    message: string,
    errors?: ZodFlatError<any, string> | string
  ) {
    super(message);
    this.status = 'error';
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
  }
}

export default HttpException;
