// eslint-disable-next-line max-classes-per-file
export class HttpException extends Error {
    statusCode?: number;
    status?: number;
    message: string;
    error: string | null;
    errorCode: string | null;

    constructor(statusCode: number, message: string, error?: string, errorCode?: string, stack?: string) {
        super(message);

        this.statusCode = statusCode;
        this.message = message;
        this.error = error || '';
        this.errorCode = errorCode || '';
        this.stack = stack || '';
    }
}

export class Forbidden extends HttpException {
    constructor(message?: string) {
        super(403, message || 'Forbidden', 'Forbidden');
    }
}
export class Unauthorized extends HttpException {
    constructor(error?: string, errorCode?: string) {
        super(401, 'Unauthorized', error, errorCode);
    }
}
