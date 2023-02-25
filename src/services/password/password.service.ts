import bcrypt = require('bcrypt');
import { IPasswordService } from './types';

export class PasswordService implements IPasswordService {
    async encryptPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    comparePassword(password: string, encryptedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, encryptedPassword);
    }
}
