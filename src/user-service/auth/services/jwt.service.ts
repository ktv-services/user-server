import { Injectable } from '@nestjs/common';
/* eslint @typescript-eslint/no-var-requires: "off" */
// tslint:disable-next-line:no-var-requires
const jwt = require('json-web-token');
import { UpdateUserDto } from "../../user/dtos/update-user.dto";

@Injectable()
export class JwtService {
    private secret: string = 'jds78a4ac4a4m8mc84mcm84mc48mc48';

    async createToken(user: UpdateUserDto): Promise<string> {
        const timeDay = 86400000;
        const payload = {
            id: user._id,
            email: user.email,
            role: user.role.name,
            iat: Date.now(),
            exp: Date.now() + (timeDay * 7),
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
