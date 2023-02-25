import { Schema } from 'mongoose';
import { IBaseModel } from './IBase';

export interface IRole extends IBaseModel {
    name: string;
    code: string;
    isAdmin: boolean;
    isSystemGenerated: boolean;
    permissions: Schema.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
    createdBy: Schema.Types.ObjectId;
    updatedBy: Schema.Types.ObjectId;
}
