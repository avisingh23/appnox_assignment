import { PermissionType } from '../../db/types';
import { IPermission, IRole, IUser } from '../../db/interfaces';
import { IPermissionService, IPermissionServiceParams } from './types';
import { MongoHelper } from '../../helpers';

export class PermissionService implements IPermissionService {
    _: IPermissionServiceParams;

    constructor(params: IPermissionServiceParams) {
        this._ = params;
    }

    async canDeleteUser(user: IUser): Promise<boolean> {
        const deleteUserPermission = [PermissionType.DeleteUser];
        const [role, permissions] = await Promise.all([
            this._.roleRepository.findOne({
                code: user.role,
            }),
            this.findPermissions(deleteUserPermission),
        ]);
        return this.isPermissionsAllowed(user, role, permissions);
    }

    private isPermissionsAllowed(user: IUser, role: IRole | null, permissions: IPermission[]): boolean {
        if (!role) {
            return false;
        }

        const userAllowedPermissionIds = role ? role.permissions.map((v) => v.toString()) : [];
        // user permission are overwritten on role permissions
        user.permissions.forEach((userPermission) => {
            const permissionId = userPermission.permissionId.toString();
            const permissionIdIndex = userAllowedPermissionIds.indexOf(permissionId);
            const permissionExists = permissionIdIndex >= 0;
            if (userPermission.allowed) {
                if (!permissionExists) {
                    userAllowedPermissionIds.push(permissionId);
                }
            } else if (permissionExists) {
                // not allowed, remove if permission exists
                userAllowedPermissionIds.splice(permissionIdIndex, 1);
            } else {
                // do nothing
            }
        });

        return permissions.every((permission) => {
            const userPermission = userAllowedPermissionIds.find((userAllowedPermissionId) =>
                MongoHelper.areIdsEqual(permission._id, userAllowedPermissionId),
            );
            return !!userPermission;
        });
    }

    private async findPermissions(codes: string[]): Promise<IPermission[]> {
        const permissions = await this._.permissionRepository.find({
            code: {
                $in: codes,
            },
        });
        return permissions;
    }
}
