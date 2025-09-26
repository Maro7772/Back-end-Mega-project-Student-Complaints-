export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error1";
    this.isOperational = true;

    // بيحافظ على stack trace بدون ما يظهر الكلاس نفسه
    Error.captureStackTrace(this, this.constructor);
  }
}
