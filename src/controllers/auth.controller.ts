import { Request, Response } from 'express';
import { IAuthTokenService } from '../services/service.interface';
import { IAuthController } from './controller.interface';

export class AuthController implements IAuthController {
    authTokenService: IAuthTokenService;

    constructor(authTokenService: IAuthTokenService) {
        this.authTokenService = authTokenService;
    }

    async createToken(req: Request, res: Response): Promise<Response> {
        const payload = req.body as unknown as { id: string };
        const tokenResponse = await this.authTokenService.createToken(payload.id);
        return res.json(tokenResponse);
    }

    async validateToken(req: Request, res: Response): Promise<Response> {
        const payload = req.body as unknown as { token: string };
        const tokenResponse = await this.authTokenService.validateToken(payload.token);
        return res.json(tokenResponse);
    }
}
