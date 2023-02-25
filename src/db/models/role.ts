import { Schema, model } from 'mongoose';
import { IRole } from '../interfaces';

const roleSchema = new Schema<IRole>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        code: {
            type: String,
            required: true,
            unique: true,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        isSystemGenerated: {
            type: Boolean,
            default: false,
        },
        permissions: {
            _id: false,
            type: [Schema.Types.ObjectId],
            default: [],
        },
        createdBy: {
            type: Schema.Types.ObjectId,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
        },
    },
    {
        timestamps: true,
        collection: 'role',
    },
);

export const Role = model<IRole>('role', roleSchema);
