import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { HttpException } from '../error';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
    const status = error.statusCode || error.status || 500;
    res.status(status).send(error);
};
