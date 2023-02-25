import { Request, Response } from 'express';
import { Model } from 'mongoose';
import Joi from 'joi';
import { IUser } from '../db/interfaces';
import { ILogger } from '../interfaces';
import { IAdminLoginController } from './controller.interface';
import { IAuthTokenService } from '../services/service.interface';
import { Errors, HttpException } from '../error';
import { RoleTypes } from '../db';
import { EventEmitter } from '../lib/event';
import { EventTypes } from '../events';
import { IPasswordService } from '../services/password/types';

interface AdminLoginControllerParams {
    userRepository: Model<IUser>;
    authTokenService: IAuthTokenService;
    logger: ILogger;
    eventEmitter: EventEmitter;
    passwordService: IPasswordService;
}

export const AdminLoginApiSchema = {
    login: Joi.object({
        username: Joi.string().trim().normalize().required(),
        password: Joi.string().trim().normalize().required(),
    }).required(),
};

export class AdminLoginController implements IAdminLoginController {
    userRepository: Model<IUser>;
    authTokenService: IAuthTokenService;
    logger: ILogger;
    eventEmitter: EventEmitter;
    passwordService: IPasswordService;

    constructor(params: AdminLoginControllerParams) {
        this.userRepository = params.userRepository;
        this.authTokenService = params.authTokenService;
        this.logger = params.logger;
        this.eventEmitter = params.eventEmitter;
        this.passwordService = params.passwordService;
    }

    async login(req: Request, res: Response): Promise<Response> {
        const { username, password } = req.body;
        const adminUser = await this.userRepository.findOne({
            username,
            role: RoleTypes.Admin,
        });
        if (!adminUser) {
            throw new HttpException(400, '', Errors.auth.err0003.error, Errors.auth.err0003.code);
        }
        const isPasswordSame = await this.passwordService.comparePassword(password, adminUser.password || '');
        if (!isPasswordSame) {
            throw new HttpException(400, '', Errors.auth.err0003.error, Errors.auth.err0003.code);
        }

        const tokenResponse = await this.authTokenService.createToken(adminUser._id.toString());

        this.eventEmitter.emit(EventTypes.UserLogin, { userId: adminUser._id });

        return res.json(tokenResponse);
    }
}
