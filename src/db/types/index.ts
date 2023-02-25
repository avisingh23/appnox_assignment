// define global enums or constants related to models here
export enum UserStatus {
    New = 'new',
    Active = 'active',
    Blocked = 'blocked',
    Deleted = 'deleted',
}

export enum RoleTypes {
    User = 'user',
    Admin = 'admin',
}

export enum PermissionType {
    DeleteUser = 'deleteUser',
}

export enum RunType {
    One = 'ones',
    Repeated = 'repeated',
}

export enum HttpRequestMethod {
    Post = 'POST',
    Get = 'GET',
    Put = 'PUT',
    Patch = 'PATCH',
    Delete = 'DELETE',
}
export enum UserLoginStatus {
    LoggedIn = 'loggedIn',
    LoggedOut = 'loggedOut',
}
