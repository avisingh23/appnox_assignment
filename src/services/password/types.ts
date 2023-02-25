export interface IPasswordService {
    encryptPassword(password: string): Promise<string>;
    comparePassword(password: string, encryptedPassword: string): Promise<boolean>;
}
