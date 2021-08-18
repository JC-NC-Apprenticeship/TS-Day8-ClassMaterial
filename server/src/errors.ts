import { NextFunction, Request, Response } from 'express';
import { ErrorResponse } from '../../common/apiSchema';

export const send405 = (req: Request, res: Response<ErrorResponse>) => {
  res.status(405).send({ status: 405, msg: 'Method not allowed' });
};

export const customErrors = (
  err: ErrorResponse,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  res.status(err.status).send(err);
};
