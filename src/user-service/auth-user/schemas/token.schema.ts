import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TokenDocument = Token & Document;

@Schema()
export class Token {
    @Prop({ required: true, type: 'string', unique: true, max: 255 })
    hash: string;

    @Prop({ required: true, type: 'string' })
    status: string;

    @Prop({type: 'Date'})
    expired: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
