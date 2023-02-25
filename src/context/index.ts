import path from 'path';
import config, { IConfig } from 'config';
import winston from 'winston';
// import _ from 'lodash';
import { IAuthTokenService } from '../services/service.interface';
import {
    IAdminLoginController,
    IAuthController,
    IUserController,
    ICartController,
    IItemController,
    IOrderController,
} from '../controllers/controller.interface';
import { DBConnection } from '../db';
import { AuthTokenService, PasswordService } from '../services';
import { AdminLoginController, AuthController, UserController, ItemController, CartController, OrderController } from '../controllers';
import { ILogger } from '../interfaces';
import { IContext } from './types';
import { EventEmitter, initEventEmitter } from '../lib/event';
import { registerLoginEvents } from '../events';
import { IPasswordService } from '../services/password/types';

export class Context implements IContext {
    services: {
        authTokenService?: IAuthTokenService;
        passwordService?: IPasswordService;
    } = {};

    controllers: {
        authController?: IAuthController;
        adminLoginController?: IAdminLoginController;
        userController?: IUserController;
        itemController?: IItemController;
        cartController?: ICartController;
        orderController?: IOrderController;
    } = {};

    db: DBConnection;

    config: IConfig;

    logger: ILogger;

    eventEmitter: EventEmitter;

    getConfig(key: string) {
        return config.get(key);
    }

    isProduction(): boolean {
        return process.env.NODE_ENV === 'production';
    }
}

const ctx = new Context();

export async function initContext() {
    // const isDebugMode = !ctx.isProduction();

    // step - load config
    ctx.config = config;
    ctx.eventEmitter = initEventEmitter();

    // step - load uploadDir
    const basePath = path.join(__dirname, '../../');
    const logsDir = path.join(basePath, 'logs');

    // step - load logger
    ctx.logger = ctx.isProduction()
        ? winston.createLogger({
              level: 'error',
              format: winston.format.json(),
              transports: [
                  new winston.transports.File({ dirname: logsDir, filename: 'error.log', level: 'error' }),
                  new winston.transports.File({ dirname: logsDir, filename: 'combined.log' }),
              ],
          })
        : winston.createLogger({
              level: 'info',
              format: winston.format.json(),
              transports: [new winston.transports.File({ dirname: logsDir, filename: 'combined.log' }), new winston.transports.Console()],
          });

    // step - init db connection
    ctx.db = new DBConnection({
        uri: config.get('app.mongodb.uri'),
        options: {
            autoIndex: true,
            autoCreate: true,
            dbName: config.get('app.mongodb.db'),
        },
    });
    await ctx.db.connect(config.get('app.mongodb.debug'));
    await ctx.db.registerCollections();

    // services
    ctx.services.authTokenService = new AuthTokenService({
        secretKey: config.get('app.auth.secretKey'),
        expiration: config.get('app.auth.expiration'),
    });
    ctx.services.passwordService = new PasswordService();

    // controllers
    ctx.controllers.authController = new AuthController(ctx.services.authTokenService);
    ctx.controllers.adminLoginController = new AdminLoginController({
        userRepository: ctx.db.repository.user,
        authTokenService: ctx.services.authTokenService,
        logger: ctx.logger,
        eventEmitter: ctx.eventEmitter,
        passwordService: ctx.services.passwordService,
    });
    ctx.controllers.userController = new UserController({
        userRepository: ctx.db.repository.user,
        authTokenService: ctx.services.authTokenService,
        logger: ctx.logger,
        eventEmitter: ctx.eventEmitter,
        passwordService: ctx.services.passwordService,
    });
    ctx.controllers.itemController = new ItemController({
        itemRepository: ctx.db.repository.item,
        logger: ctx.logger,
    });
    ctx.controllers.cartController = new CartController({
        cartRepository: ctx.db.repository.cart,
        itemRepository: ctx.db.repository.item,
        logger: ctx.logger,
    });
    ctx.controllers.orderController = new OrderController({
        orderRepository: ctx.db.repository.order,
        cartRepository: ctx.db.repository.cart,
        userRepository: ctx.db.repository.user,
        logger: ctx.logger,
    });

    // events
    registerLoginEvents(ctx);
}

export function loadContext() {
    return ctx;
}
