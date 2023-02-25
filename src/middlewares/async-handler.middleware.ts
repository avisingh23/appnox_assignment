import { HttpException } from '../error';

export const asyncHandler = (fn: Function) => {
    return function asyncUtilWrap(...args: any[]) {
        const fnReturn = fn(...args);
        const next = args[args.length - 1];
        return Promise.resolve(fnReturn).catch((e) => {
            if (e instanceof HttpException) {
                next(e);
            } else {
                next(new HttpException(500, '', e.message, '', e.stack));
            }
        });
    };
};
