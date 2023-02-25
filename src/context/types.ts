import { IConfig } from 'config';
import { IAuthTokenService } from '../services/service.interface';
import { IAdminLoginController, IAuthController, IUserController } from '../controllers/controller.interface';
import { DBConnection } from '../db';
import { ILogger } from '../interfaces';
import { EventEmitter } from '../lib/event';
import { IPasswordService } from '../services/password/types';

export interface IContext {
    services: {
        authTokenService?: IAuthTokenService;
        passwordService?: IPasswordService;
    };

    controllers: {
        authController?: IAuthController;
        adminLoginController?: IAdminLoginController;
        userController?: IUserController;
    };

    db: DBConnection;

    config: IConfig;

    logger: ILogger;

    eventEmitter: EventEmitter;

    getConfig(key: string): unknown;

    isProduction(): boolean;

    // down(): Promise<void>;
}
