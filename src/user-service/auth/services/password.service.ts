import { Injectable } from '@nestjs/common';
/* eslint @typescript-eslint/no-var-requires: "off" */
// tslint:disable-next-line:no-var-requires
const bcrypt = require('bcrypt');

@Injectable()
export class PasswordService {
    async hashPassword(password: string): Promise<string> {
        const saltRound = '10';
        const salt = bcrypt.genSaltSync(parseInt(saltRound));
        return bcrypt.hashSync(password, salt);
    }

    async comparePassword(password: string, hashPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashPassword);
    };
}
