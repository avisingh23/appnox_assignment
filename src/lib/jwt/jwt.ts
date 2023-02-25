/* eslint-disable no-use-before-define */
/* eslint-disable max-classes-per-file */
import { randomBytes } from 'crypto';
import { sign, SignOptions, verify } from 'jsonwebtoken';

type Algorithm =
    | 'HS256' // HMAC using SHA-256 hash algorithm (default)
    | 'HS384' // HMAC using SHA-384 hash algorithm
    | 'HS512' // HMAC using SHA-512 hash algorithm
    | 'RS256' // RSASSA using SHA-256 hash algorithm
    | 'RS384' // RSASSA using SHA-384 hash algorithm
    | 'RS512' // RSASSA using SHA-512 hash algorithm
    | 'ES256' // ECDSA using P-256 curve and SHA-256 hash algorithm
    | 'ES384' // ECDSA using P-384 curve and SHA-384 hash algorithm
    | 'ES512' // ECDSA using P-521 curve and SHA-512 hash algorithm
    | 'none'; // No digital signature or MAC value included

interface JWTPayload {
    extras: { [key: string]: string };
    scope: Array<string>;
    iat: number;
    aud: string;
    iss: string;
    sub: string;
    jti: string;
    exp?: number;
    nbf?: number;
}

export class JWT {
    private expiration: number = 3600;
    private notBefore: number = 0;
    private scopes: Set<string> = new Set();
    private extraClaims: Map<string, string> = new Map();
    private algorithm: Algorithm = 'RS512';

    private jti: string = randomBytes(32).toString('hex');

    private issuer: string = '';
    private subject: string = '';
    private audience: string = '';

    public setIssuer(issuer: string) {
        this.issuer = issuer;
    }

    public setSubject(subject: string) {
        this.subject = subject;
    }

    public setAudience(aud: string) {
        this.audience = aud;
    }

    public addScope(scope: string) {
        this.scopes.add(scope);
    }

    public removeScope(scope: string) {
        this.scopes.delete(scope);
    }

    public setClaim(claim: string, value: string) {
        this.extraClaims.set(claim, value);
    }

    public setExpirationTime(seconds: number) {
        this.expiration = seconds;
    }

    public setNotBefore(seconds: number) {
        this.notBefore = seconds;
    }

    public setAlgorithm(algorithm: Algorithm) {
        this.algorithm = algorithm;
    }

    public sign(key: string, keyId?: string): string {
        const claims: { extras: { [key: string]: any }; scope: Array<string> } = {
            extras: {},
            scope: [],
        };

        this.extraClaims.forEach((v, k) => {
            claims.extras[k] = v;
        });

        const sOptions: SignOptions = {
            algorithm: this.algorithm,
            jwtid: this.jti,
            audience: this.audience,
            issuer: this.issuer,
            subject: this.subject,
        };

        if (keyId !== undefined) {
            sOptions.keyid = keyId;
        }
        if (this.expiration > 0) {
            sOptions.expiresIn = this.expiration;
        }
        if (this.notBefore > 0) {
            sOptions.notBefore = this.notBefore;
        }

        claims.scope = Array.from(this.scopes);

        return sign(claims, key, sOptions);
    }

    public static resign(): Promise<{ token: string; ttl: number }> {
        return Promise.resolve().then(() => {
            return new Promise(() => {});
        });
    }

    public getIssuer() {
        return this.issuer;
    }

    public getSubject() {
        return this.subject;
    }

    public getAudience() {
        return this.audience;
    }

    public getJTI() {
        return this.jti;
    }

    public getScopes() {
        return this.scopes;
    }

    public hasScope(scope: string) {
        return this.scopes.has(scope);
    }

    public getClaim(key: string) {
        return this.extraClaims.get(key);
    }

    public static decode(token: string, key: string, algorithm: Algorithm): Promise<JWT> {
        return new Promise((resolve, reject) => {
            verify(
                token,
                key,
                {
                    algorithms: [algorithm || 'HS256'],
                },
                (err: Error | null, payload: any) => {
                    if (err) {
                        if (err.name === 'TokenExpiredError') {
                            return reject(new JWTVerifyError('Token Expired'));
                        }
                        if (err.name === 'JsonWebTokenError') {
                            return reject(new JWTVerifyError('Token verification failed'));
                        }
                        if (err.name === 'NotBeforeError') {
                            return reject(new JWTVerifyError('Token not useful yet'));
                        }
                    }

                    const p = payload as JWTPayload;
                    const j = new JWT();

                    j.issuer = p.iss;
                    j.subject = p.sub;
                    j.audience = p.aud;
                    j.jti = p.jti;
                    j.scopes = new Set(p.scope);
                    j.algorithm = algorithm;
                    j.expiration = 0;
                    j.notBefore = 0;

                    if (p.exp) {
                        j.expiration = p.exp - p.iat;
                    }
                    if (p.nbf) {
                        j.notBefore = p.nbf - p.iat;
                    }

                    Object.keys(p.extras).forEach((extraKey) => {
                        j.extraClaims.set(extraKey, p.extras[extraKey]);
                    });

                    return resolve(j);
                },
            );
        });
    }
}

export class JWTVerifyError extends Error {
    // eslint-disable-next-line no-useless-constructor
    constructor(msg: string) {
        super(msg);
    }
}
