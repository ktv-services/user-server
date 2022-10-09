import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from '../schemas/token.schema';
import { Model } from 'mongoose';
import { CreateTokenDto } from '../dtos/token/create-token.dto';
import { TokenDto } from '../dtos/token/token.dto';

@Injectable()
export class TokenService {
    constructor(
        @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    ) {}

    async removeTokenEntry (hash: string): Promise<void> {
        const token: TokenDto[] = await this.tokenModel.find({ hash }).exec();
        if (token[0]) {
            this.tokenModel.findByIdAndRemove(token[0]._id);
        }
    }

    async create(createTokenDto: CreateTokenDto): Promise<TokenDto>  {
        const createdToken: any = new this.tokenModel(createTokenDto);
        const token: TokenDto = await createdToken.save();
        return await this.tokenModel.findById(token._id).exec();
    }
}
