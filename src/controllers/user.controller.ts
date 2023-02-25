import { Request, Response } from 'express';
import { Model, ObjectId } from 'mongoose';
import Joi from 'joi';
import { omit } from 'lodash';
import { IUser } from '../db/interfaces';
import { ILogger, IPagination } from '../interfaces';
import { IUserController } from './controller.interface';
import { IAuthTokenService } from '../services/service.interface';
import { HttpException, Errors, Forbidden } from '../error';
import { RoleTypes, UserStatus } from '../db';
import { EventEmitter } from '../lib/event';
import { EventTypes } from '../events';
import { IPaginationParams, ISortByParams } from './types';
import { RequestHelper } from '../helpers/index';
import { IPasswordService } from '../services/password/types';

interface UserControllerParams {
    userRepository: Model<IUser>;
    authTokenService: IAuthTokenService;
    logger: ILogger;
    eventEmitter: EventEmitter;
    passwordService: IPasswordService;
}

interface IUserFilterParams extends IPaginationParams, ISortByParams {
    status?: string;
    role?: string;
    username?: string;
    mobileNumber?: number;
    id?: ObjectId;
}

function createResponse(users: IUser) {
    return {
        users,
    };
}

function createPaginationResponse(response: any[], pagination: IPagination) {
    return {
        data: response,
        pagination,
    };
}

export const UserApiSchema = {
    Login: Joi.object({
        email: Joi.string().email().trim().normalize().optional(),
        password: Joi.string().trim().normalize().required(),
        mobile: Joi.string()
            .regex(/^[0-9]{10}$/)
            .messages({ 'string.pattern.base': Errors.mobileValidation.err0301.error })
            .optional(),
    }).required(),
    Signup: Joi.object({
        username: Joi.string().trim().normalize(),
        password: Joi.string().trim().normalize().required(),
        firstname: Joi.string().trim().normalize(),
        lastname: Joi.string().trim().normalize(),
        email: Joi.string().email().trim().normalize().required(),
        mobile: Joi.string()
            .regex(/^[0-9]{10}$/)
            .messages({ 'string.pattern.base': Errors.mobileValidation.err0301.error })
            .required(),
    }).required(),
    UpdatePassword: Joi.object({
        email: Joi.string().email().trim().normalize().required(),
        otp: Joi.string()
            .regex(/^[0-9]{6}$/)
            .messages({ 'string.pattern.base': Errors.mobileValidation.err0302.error })
            .required(),
        password: Joi.string().trim().normalize().required(),
    }).required(),
    UpdateUserById: Joi.object({
        username: Joi.string().trim().normalize(),
        about: Joi.string().trim().normalize(),
        firstname: Joi.string().trim().normalize(),
        lastname: Joi.string().trim().normalize(),
    }),
    ChangePassword: Joi.object({
        currentPassword: Joi.string().trim().normalize().required(),
        newPassword: Joi.string().trim().normalize().required(),
    }).required(),
};

export class UserController implements IUserController {
    userRepository: Model<IUser>;
    authTokenService: IAuthTokenService;
    logger: ILogger;
    eventEmitter: EventEmitter;
    passwordService: IPasswordService;

    constructor(params: UserControllerParams) {
        this.userRepository = params.userRepository;
        this.authTokenService = params.authTokenService;
        this.logger = params.logger;
        this.eventEmitter = params.eventEmitter;
        this.passwordService = params.passwordService;
    }

    async login(req: Request, res: Response): Promise<Response> {
        const { email, password, mobile } = req.body;
        if (!email && !mobile) {
            throw new HttpException(400, '', Errors.auth.err0017.error, Errors.auth.err0017.code);
        }
        const user = await this.userRepository
            .findOne({
                $or: [{ 'email.address': email }, { 'mobile.number': mobile }],
            })
            .select('+password');
        if (!user) {
            throw new HttpException(400, '', Errors.auth.err0003.error, Errors.auth.err0003.code);
        }
        if (user.status === UserStatus.Deleted) {
            throw new HttpException(400, '', Errors.auth.err0015.error, Errors.auth.err0015.code);
        }
        const isPasswordSame = await this.passwordService.comparePassword(password, user.password || '');
        if (!isPasswordSame) {
            throw new HttpException(400, '', Errors.auth.err0002.error, Errors.auth.err0002.code);
        }

        const tokenResponse = await this.authTokenService.createToken(user._id.toString());

        this.eventEmitter.emit(EventTypes.UserLogin, { userId: user._id });
        return res.json(tokenResponse);
    }

    async signup(req: Request, res: Response): Promise<Response> {
        const { username, firstname, lastname, email, password, mobile } = req.body;
        const pass = await this.passwordService.encryptPassword(password);
        const users = await this.userRepository.findOne({
            $or: [{ 'email.address': email }],
        });

        if (users && users.email && users.email.address === email) {
            throw new HttpException(400, '', Errors.auth.err0012.error, Errors.auth.err0012.code);
        }
        const user = await this.userRepository.create({
            username,
            role: RoleTypes.User,
            password: pass,
            mobile: {
                countryCode: '+91',
                number: mobile,
                isVerified: false,
            },
            name: {
                first: firstname,
                last: lastname,
            },
            email: {
                address: email,
                isVerified: false,
            },
        });
        if (!user) {
            throw new HttpException(400, '', Errors.auth.err0005.error, Errors.auth.err0005.code);
        }
        const userWithoutPass = omit(user.toJSON(), ['password', 'otpRequestId']);
        return res.json(userWithoutPass);
    }

    async getUserById(req: Request, res: Response): Promise<Response> {
        const { userId } = req.params;

        const isAdminUser = req.isAdmin;
        // step - check - only admin can access others data
        if (!isAdminUser && userId !== req.user?.id.toString()) {
            throw new Forbidden();
        }

        const data = await this.userRepository.findOne({ _id: userId });
        if (!data) {
            throw new HttpException(400, '', Errors.auth.err0009.error, Errors.auth.err0009.code);
        }
        return res.json({
            data,
        });
    }

    async updateUserById(req: Request, res: Response): Promise<Response> {
        const {
            params: { userId },
            body: { username, about, firstname, lastname },
        } = req;
        if (!username && !about && !firstname && !lastname) {
            throw new HttpException(400, '', Errors.auth.err0018.error, Errors.auth.err0018.code);
        }
        const isAdminUser = req.isAdmin;
        // step - check - only admin can access others data
        if (!isAdminUser && userId !== req.user?.id.toString()) {
            throw new Forbidden();
        }
        const data = await this.userRepository.findOne({ _id: userId });
        if (!data) {
            throw new HttpException(400, '', Errors.auth.err0009.error, Errors.auth.err0009.code);
        }
        const user = await this.userRepository.findByIdAndUpdate(
            userId,
            {
                $set: { username, about, name: { first: firstname, last: lastname } },
            },
            { new: true },
        );
        if (!user) {
            throw new HttpException(400, '', Errors.auth.err0009.error, Errors.auth.err0009.code);
        }
        return res.json(user);
    }

    async changePassword(req: Request, res: Response): Promise<Response> {
        const {
            params: { userId },
            body: { currentPassword, newPassword },
        } = req;
        const user = await this.userRepository.findOne({ _id: userId }).select('+password');
        if (!user) {
            throw new HttpException(400, '', Errors.auth.err0009.error, Errors.auth.err0009.code);
        }
        const isPasswordSame = await this.passwordService.comparePassword(currentPassword, user.password || '');
        if (!isPasswordSame) {
            throw new HttpException(400, '', Errors.auth.err0008.error, Errors.auth.err0008.code);
        }
        const password = await this.passwordService.encryptPassword(newPassword);
        await this.userRepository.findByIdAndUpdate(userId, {
            $set: { password },
        });
        return res.json({
            status: 'success',
            message: 'password changed successfully',
        });
    }

    async getAllUsers(req: Request, res: Response): Promise<Response> {
        const filterQuery: IUserFilterParams = req.query;
        const { offset, limit } = RequestHelper.parsePaginationParams(filterQuery);

        const criteria: any = {};
        if (filterQuery.status) {
            criteria.status = {
                $eq: filterQuery.status,
            };
        }
        if (filterQuery.username) {
            const username: any = filterQuery.username.trim();
            criteria.username = {
                $regex: new RegExp(`^${username}$`, 'i'),
            };
        }
        if (filterQuery.id) {
            criteria._id = {
                $eq: filterQuery.id,
            };
        }
        if (filterQuery.role) {
            const roles = filterQuery.role.split(',');
            criteria.role =
                roles.length === 1
                    ? {
                          $eq: filterQuery.role,
                      }
                    : {
                          $in: roles,
                      };
        }
        const sortBy = RequestHelper.parseSortByParams(filterQuery);
        const totaljobs = await this.userRepository.where(criteria).count();
        const query = this.userRepository.where(criteria);
        query.skip(offset);
        if (limit) {
            query.limit(limit);
        }
        if (sortBy) {
            query.sort(sortBy);
        }
        const users = await query.find();
        const data = users.map((job) => createResponse(job));
        const pagination: IPagination = {
            offset,
            total: totaljobs,
            count: users.length,
            limit: limit || -1,
        };
        const response = createPaginationResponse(data, pagination);
        return res.json(response);
    }

    async deleteUserById(req: Request, res: Response): Promise<Response> {
        const { userId } = req.params;
        const isAdminUser = req.isAdmin;
        // step - check - only admin can access others data
        if (!isAdminUser && userId !== req.user?.id.toString()) {
            throw new Forbidden();
        }
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new HttpException(400, '', Errors.auth.err0009.error, Errors.auth.err0009.code);
        }
        await this.userRepository.findByIdAndUpdate(user._id, {
            $set: { status: UserStatus.Deleted },
        });
        return res.json();
    }
}
