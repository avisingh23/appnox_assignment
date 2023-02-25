import { AuthToken, AuthTokenValidation } from '../interfaces';
import { JWT } from '../lib/jwt/jwt';
import { IAuthTokenService } from './service.interface';

const TokenAlgorithm = 'HS256';

export class AuthTokenService implements IAuthTokenService {
    secretKey: string;
    expiration: number;

    constructor(params: { secretKey: string; expiration: number }) {
        this.secretKey = params.secretKey;
        this.expiration = params.expiration;
    }

    createToken(id: string): Promise<AuthToken> {
        const expires = new Date(new Date().getTime() + this.expiration * 1000);
        const now = new Date();

        const jwt = new JWT();
        jwt.setSubject(id);
        jwt.setAlgorithm(TokenAlgorithm);
        jwt.setExpirationTime(this.expiration);
        const token = jwt.sign(this.secretKey);
        return Promise.resolve({
            id,
            token,
            expires,
            now,
            scopes: [...jwt.getScopes()],
        });
    }

    async validateToken(token: string): Promise<AuthTokenValidation> {
        const jwt = await JWT.decode(token, this.secretKey, TokenAlgorithm);
        return Promise.resolve({
            id: jwt.getSubject(),
            scopes: [...jwt.getScopes()],
        });
    }
}
