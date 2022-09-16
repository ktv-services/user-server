import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenDocument } from '../schemas/token.schema';
import { Model } from 'mongoose';
import { CreateTokenDto } from '../dtos/create-token.dto';

@Injectable()
export class TokenService {
    constructor(
        @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    ) {}

    async removeTokenEntry (id: string): Promise<void> {
        this.tokenModel.findByIdAndRemove(id);
    }

    async create(createTokenDto: CreateTokenDto): Promise<Token>  {
        const createdToken = new this.tokenModel(createTokenDto);
        const token = await createdToken.save();
        return await this.tokenModel.findById(token._id).exec();
    }
}
