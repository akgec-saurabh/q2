export class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong on the Server",
    errors = [],
    data = null
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.message = message;
    this.success = false;
    this.data = data;

    Error.captureStackTrace(this, this.constructor);
  }

  getResponse() {
    return {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      errors: this.errors,
      data: this.data,
    };
  }
}
