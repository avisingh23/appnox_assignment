import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { IOrder, IUser, ICart } from '../db/interfaces';
import { ILogger } from '../interfaces';
import { IOrderController } from './controller.interface';
import { Errors, HttpException } from '../error';

interface OrderControllerParams {
    orderRepository: Model<IOrder>;
    userRepository: Model<IUser>;
    cartRepository: Model<ICart>;
    logger: ILogger;
}

export class OrderController implements IOrderController {
    orderRepository: Model<IOrder>;
    userRepository: Model<IUser>;
    cartRepository: Model<ICart>;
    logger: ILogger;

    constructor(params: OrderControllerParams) {
        this.userRepository = params.userRepository;
        this.cartRepository = params.cartRepository;
        this.orderRepository = params.orderRepository;
        this.logger = params.logger;
    }

    async checkout(req: Request, res: Response): Promise<void> {
        const {
            params: { userId },
        } = req;
        const cart = await this.cartRepository.findOne({ userId });
        const user = await this.userRepository.findOne({ _id: userId });
        if (!cart) {
            throw new HttpException(400, '', Errors.item.err0401.error, Errors.item.err0401.code);
        }
        if (!user) {
            throw new HttpException(400, '', Errors.auth.err0003.error, Errors.auth.err0003.code);
        }
        if (cart) {
            const order = await this.orderRepository.create({
                userId,
                items: cart.items,
                bill: cart.bill,
            });
            await this.cartRepository.findByIdAndDelete({ _id: cart.id });
            res.json(order);
        } else {
            throw new HttpException(400, '', Errors.cart.err0501.error, Errors.cart.err0501.code);
        }
    }

    async getOrders(req: Request, res: Response): Promise<Response> {
        const { userId } = req.params;
        const order = await this.orderRepository.findOne({ userId }).sort({ date: -1 });
        if (!order) {
            throw new HttpException(400, '', Errors.order.err0601.error, Errors.order.err0601.code);
        }
        return res.json(order);
    }
}
