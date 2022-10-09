import { Injectable } from '@nestjs/common';
/* eslint @typescript-eslint/no-var-requires: "off" */
// tslint:disable-next-line:no-var-requires
const bcrypt = require('bcrypt');
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PasswordService {
    constructor(
        private configService: ConfigService
    ) {}

    async hashPassword(password: string): Promise<string> {
        const saltRound: string = this.configService.get<string>('SALT_ROUND');
        const salt: string = bcrypt.genSaltSync(parseInt(saltRound));
        return bcrypt.hashSync(password, salt);
    }

    async comparePassword(password: string, hashPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashPassword);
    };
}
