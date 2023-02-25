import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
// import _ from 'lodash';
import { UserStatus, RoleTypes, UserLoginStatus } from '../db/types';

import { HttpException } from '../error';
import { IAuthTokenService } from '../services/service.interface';
import { Context } from '../context';

export const validateRequestBody = (schema: Joi.Schema) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await schema.validateAsync(req.body, {
                abortEarly: false,
                convert: true, // this will convert values are required
            });
            // overwrite body - due to conversion
            req.body = data;
            next();
        } catch (error) {
            res.status(422).send({
                errors: (error as any).details,
            });
        }
    };
};

export const validateBasicAuth = (ctx: Joi.Context) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const basicAuth = ctx.getConfig('app.basicAuth');
        const basicAuthHeader = req.header('BasicAuth');
        if (basicAuthHeader !== basicAuth) {
            throw new HttpException(401, '', 'Missing Auth!', '');
            // res.status(403).json({ error: 'Missing Auth!' }).send();
        } else {
            next();
        }
    };
};

export const validateUserAuthentication = (ctx: Context) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const bearerHeader = req.headers.authorization;
        const statusCode = 401;
        if (!bearerHeader) {
            res.status(statusCode).json({ error: 'Missing User Auth!' }).send();
        } else {
            const parts = bearerHeader.split(/\s+/);
            if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer' || parts[1].split('.').length !== 3) {
                res.status(statusCode).send();
            } else {
                const bearerToken = parts[1];
                try {
                    const authTokenValidation = await (ctx.services.authTokenService as IAuthTokenService).validateToken(bearerToken);
                    const user = await ctx.db.repository.user.findById(authTokenValidation.id);
                    if (!user) {
                        res.status(statusCode).send();
                    } else if (user.status === UserStatus.Blocked) {
                        throw new HttpException(statusCode, '', 'Your account is blocked', '');
                    } else if (user.role === RoleTypes.User) {
                        req.user = user;
                        if (!authTokenValidation.userLoginId) {
                            next();
                        } else {
                            const userLogin = await ctx.db.repository.userLogin.findById(authTokenValidation.userLoginId);
                            if (!userLogin) {
                                throw new HttpException(statusCode, 'Unauthorized');
                            } else if (userLogin.status !== UserLoginStatus.LoggedIn) {
                                throw new HttpException(statusCode, 'Unauthorized');
                            }
                            next();
                        }
                    } else {
                        req.user = user;
                        req.isAdmin = user.role === RoleTypes.Admin;
                        next();
                    }
                } catch (e) {
                    res.status(statusCode).send();
                }
            }
        }
    };
};

export const checkUserRole = (userRole: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return async (req: Request, res: Response, next: NextFunction) => {
        const { user } = req;
        if (!user) {
            res.status(403).send();
        }

        if (user?.role !== userRole) {
            res.status(403).send();
        }

        next();
    };
};

// export const validateFileUpload = (limits: {
//     fieldName: string;
//     maxNumberOfFiles: number;
//     minNumberOfFiles: number;
//     fileTypesAllowed: string[];
//     maxFileSize: number;
//     ignoreIfFileNotPresent: boolean;
// }) => {
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     return async (req: Request, res: Response, next: NextFunction) => {
//         const { fieldName, maxNumberOfFiles, minNumberOfFiles, fileTypesAllowed, maxFileSize, ignoreIfFileNotPresent } = limits;
//         const filesWithFieldName = _.filter(req.files, (file: any) => file.fieldname === fieldName);
//         if (!ignoreIfFileNotPresent || (ignoreIfFileNotPresent && filesWithFieldName.length)) {
//             if (filesWithFieldName.length < minNumberOfFiles) {
//                 throw new HttpException(422, '', `A file with the field name ${fieldName} is required`);
//             }
//             if (filesWithFieldName.length > maxNumberOfFiles) {
//                 throw new HttpException(422, '', `Only ${maxNumberOfFiles} file(s) are allowed for field name ${fieldName}`);
//             }
//             const allFilesMatchTypes = filesWithFieldName.every((file: any) => fileTypesAllowed.includes(file.mimetype));
//             if (!allFilesMatchTypes) {
//                 throw new HttpException(422, '', `Invalid file type. Valid file types are (${fileTypesAllowed.join(', ')})`);
//             }
//             // Need max file size in kb and input file size is received in kb
//             const maxSizeInKb = maxFileSize * 1024 * 1024;
//             const allFilesMatchSize = filesWithFieldName.every((file: any) => file.size <= maxSizeInKb);
//             if (!allFilesMatchSize) {
//                 throw new HttpException(422, '', `Uploaded file size is more than ${maxFileSize}MB`);
//             }
//         }
//         next();
//     };
// };
