import { Schema } from 'mongoose';
import { IBaseModel } from './IBase';

export interface IItem extends IBaseModel {
    title: String;
    description: String;
    category: String;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: Schema.Types.ObjectId;
    updatedBy: Schema.Types.ObjectId;
}
