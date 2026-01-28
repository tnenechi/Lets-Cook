import type { Response } from "express";

export class Send {
  static success(
    res: Response,
    data: any,
    message = "Success",
    statusCode = 200,
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(
    res: Response,
    message = "Error",
    statusCode = 500,
    errors: any = null,
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      data: message,
    });
  }

  static notFound(res: Response, message = "Resource not found") {
    return res.status(404).json({
      success: false,
      message,
      data: message,
    });
  }

  static unauthorized(res: Response, message = "Unauthorized") {
    return res.status(401).json({
      success: false,
      message,
      data: message,
    });
  }
}
