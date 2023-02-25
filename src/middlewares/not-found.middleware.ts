import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { HttpException } from '../error';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const notFoundHandler: ErrorRequestHandler = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
    const message = 'Resource not found';
    res.status(404).send(message);
};
