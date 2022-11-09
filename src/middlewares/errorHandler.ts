/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { HttpException } from "../commons/errors";
import { StatusCodes } from "http-status-codes";

async function errorMiddleware(
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = error.message || "Something went wrong";
  response.status(status).send({
    status,
    message,
  });
}

export default errorMiddleware;
