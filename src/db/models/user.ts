/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
import { Schema, model } from 'mongoose';
import { IUser } from '../interfaces';
import { RoleTypes, UserStatus } from '../types';

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
        },
        password: {
            type: String,
            default: null,
            select: false,
        },
        mobile: {
            _id: false,
            type: {
                countryCode: {
                    type: Number,
                },
                number: {
                    type: Number,
                },
                isVerified: {
                    type: Boolean,
                },
            },
            default: null,
        },
        name: {
            _id: false,
            type: {
                first: {
                    type: String,
                },
                last: {
                    type: String,
                },
            },
            default: null,
        },
        email: {
            _id: false,
            type: {
                address: {
                    type: String,
                    unique: true,
                    required: true,
                },
                isVerified: {
                    type: Boolean,
                },
            },
            default: null,
        },
        about: {
            type: String,
            default: null,
        },
        photo: {
            _id: false,
            type: {
                id: {
                    type: String,
                },
                url: {
                    type: String,
                },
            },
            default: null,
        },
        device: {
            _id: false,
            type: new Schema({
                fcmId: {
                    type: String,
                    default: null,
                },
                info: {
                    type: String,
                    default: null,
                },
                type: {
                    type: String,
                },
                version: {
                    type: String,
                    default: null,
                },
            }),
            default: null,
        },
        role: {
            type: String,
            default: RoleTypes.User,
            enum: [RoleTypes.Admin, RoleTypes.User],
        },
        permissions: {
            _id: false,
            type: [
                {
                    permissionId: {
                        type: String,
                    },
                    allowed: {
                        type: Boolean,
                    },
                },
            ],
            default: [],
        },
        status: {
            type: String,
            default: UserStatus.New,
            enum: [UserStatus.New, UserStatus.Active, UserStatus.Blocked],
        },
        otpRequestId: {
            type: String,
            default: null,
            select: false,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            default: null,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            default: null,
        },
    },
    {
        timestamps: true,
        collection: 'user',
    },
);

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
        delete ret._id;
    },
});

export const User = model<IUser>('user', userSchema);
