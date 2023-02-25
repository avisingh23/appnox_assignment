import { AuthToken, AuthTokenValidation } from '../interfaces';

export interface IService {}

export interface IAuthTokenService extends IService {
    createToken(id: string): Promise<AuthToken>;
    validateToken(token: string): Promise<AuthTokenValidation>;
}
