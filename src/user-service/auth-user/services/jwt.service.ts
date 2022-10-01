import { Injectable } from '@nestjs/common';
/* eslint @typescript-eslint/no-var-requires: "off" */
// tslint:disable-next-line:no-var-requires
const jwt = require('json-web-token');
import { UpdateUserDto } from '../dtos/update-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
    private secret: string = this.configService.get<string>('SECRET');

    constructor(
        private configService: ConfigService
    ) {}

    async createToken(user: UpdateUserDto): Promise<string> {
        const timeDay: number = 86400000;
        const payload: any = {
            id: user._id,
            email: user.email,
            role: user.role.name,
            iat: Date.now(),
            exp: Date.now() + (timeDay * this.configService.get<number>('TOKEN_DAYS')),
        };
        return jwt.encode(this.secret, payload, 'HS512', (err, token) => {
            if (err) {
                console.error(err.name, err.message);
            } else {
                return token;
            }
        });
    }

    async decodeToken(token): Promise<string | boolean> {
        return jwt.decode(this.secret, token, (err, decodedPayload) => {
            if (err) {
                return false;
            } else {
                return decodedPayload;
            }
        });
    }
}
