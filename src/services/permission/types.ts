import { Model } from 'mongoose';
import { IPermission, IRole, IUser } from '../../db/interfaces';

export interface IPermissionServiceParams {
    permissionRepository: Model<IPermission>;
    userRepository: Model<IUser>;
    roleRepository: Model<IRole>;
}

export interface IPermissionService {
    canDeleteUser(user: IUser): Promise<boolean>;
}
