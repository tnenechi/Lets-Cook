import type { Response } from "express";

export class Send {
  static success(
    res: Response,
    data: any,
    message = "Success",
    statusCode = 200
  ) {
    return res.status(statusCode).json({
      message,
      data,
    });
  }

  static error(
    res: Response,
    message = "Error",
    statusCode = 500,
    errors: any = null
  ) {
    return res.status(statusCode).json({
      message,
      errors,
    });
  }

  static notFound(res: Response, message = "Resource not found") {
    return res.status(404).json({
      message,
    });
  }

  static unauthorized(res: Response, message = "Unauthorized") {
    return res.status(401).json({
      message,
    });
  }
}
