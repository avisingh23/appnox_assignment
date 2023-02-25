import { Schema } from 'mongoose';
import { IBaseModel } from './IBase';

export interface IPermission extends IBaseModel {
    name: string;
    code: string;
    description: string;
    groupCode: string;
    parentId: Schema.Types.ObjectId;
}
