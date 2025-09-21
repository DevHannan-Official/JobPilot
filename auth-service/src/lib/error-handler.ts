class ErrorHandler extends Error {
  constructor(public message: string, public status: number) {
    super(message);
    this.status = status;
    this.cause = "custom";
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
