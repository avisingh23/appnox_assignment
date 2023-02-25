import { Request, Response } from 'express';
import { Model, ObjectId } from 'mongoose';
import Joi from 'joi';
import { RequestHelper } from '../helpers/index';
import { IItem } from '../db/interfaces';
import { ILogger, IPagination } from '../interfaces';
import { IItemController } from './controller.interface';
import { Errors, HttpException } from '../error';
import { IPaginationParams, ISortByParams } from './types';

interface ItemControllerParams {
    itemRepository: Model<IItem>;
    logger: ILogger;
}

interface IItemFilterParams extends IPaginationParams, ISortByParams {
    title?: string;
    description?: string;
    price?: number;
    category?: string;
    id?: ObjectId;
}

function createResponse(item: IItem) {
    return {
        item,
    };
}

function createPaginationResponse(response: any[], pagination: IPagination) {
    return {
        data: response,
        pagination,
    };
}

export const ItemApiSchema = {
    postItem: Joi.object({
        title: Joi.string().trim().normalize().required(),
        description: Joi.string().trim().normalize().required(),
        category: Joi.string().trim().normalize().required(),
        price: Joi.string().trim().normalize().required(),
    }).required(),
    updateItem: Joi.object({
        title: Joi.string().trim().normalize().optional(),
        description: Joi.string().trim().normalize().optional(),
        category: Joi.string().trim().normalize().optional(),
        price: Joi.string().trim().normalize().optional(),
    }).required(),
};

export class ItemController implements IItemController {
    itemRepository: Model<IItem>;
    logger: ILogger;

    constructor(params: ItemControllerParams) {
        this.itemRepository = params.itemRepository;
        this.logger = params.logger;
    }

    async postItem(req: Request, res: Response): Promise<Response> {
        const { title, description, price, category } = req.body;
        const item = await this.itemRepository.create({ title, description, price, category });
        return res.json(item);
    }

    async getItemById(req: Request, res: Response): Promise<Response> {
        const { itemId } = req.params;
        const data = await this.itemRepository.findOne({ _id: itemId });
        if (!data) {
            throw new HttpException(400, '', Errors.item.err0401.error, Errors.item.err0401.code);
        }
        return res.json({
            data,
        });
    }

    async getItems(req: Request, res: Response): Promise<Response> {
        const filterQuery: IItemFilterParams = req.query;
        const { offset, limit } = RequestHelper.parsePaginationParams(filterQuery);
        const sortBy = RequestHelper.parseSortByParams(filterQuery);
        const criteria: any = {};
        if (filterQuery.title) {
            criteria.title = {
                $eq: filterQuery.title,
            };
        }
        if (filterQuery.description) {
            criteria.title = {
                $eq: filterQuery.title,
            };
        }
        if (filterQuery.category) {
            criteria.category = {
                $eq: filterQuery.category,
            };
        }
        if (filterQuery.price) {
            criteria.price = {
                $eq: filterQuery.price,
            };
        }
        if (filterQuery.id) {
            criteria._id = {
                $eq: filterQuery.id,
            };
        }

        const totalItems = await this.itemRepository.where(criteria).count();
        const query = this.itemRepository.where(criteria);
        query.skip(offset);
        if (limit) {
            query.limit(limit);
        }
        if (sortBy) {
            query.sort(sortBy);
        }
        const items = await query.find();
        const data = items.map((item) => createResponse(item));
        const pagination: IPagination = {
            offset,
            total: totalItems,
            count: items.length,
            limit: limit || -1,
        };
        const response = createPaginationResponse(data, pagination);
        return res.json(response);
    }

    async updateItemById(req: Request, res: Response): Promise<Response> {
        const {
            params: { itemId },
            body: { title, description, price, category },
        } = req;
        const data = await this.itemRepository.findOne({ _id: itemId });
        if (!data) {
            throw new HttpException(400, '', Errors.item.err0401.error, Errors.item.err0401.code);
        }
        const item = await this.itemRepository.findByIdAndUpdate(
            itemId,
            {
                $set: { title, description, price, category },
            },
            { new: true },
        );
        if (!item) {
            throw new HttpException(400, '', Errors.item.err0401.error, Errors.item.err0401.code);
        }
        return res.json(item);
    }

    async deleteItemById(req: Request, res: Response): Promise<Response> {
        const { itemId } = req.params;
        const item = await this.itemRepository.findById(itemId);
        if (!item) {
            throw new HttpException(400, '', Errors.item.err0401.error, Errors.item.err0401.code);
        } else if (item) {
            item.remove();
            item.save();
        }
        return res.json();
    }
}
