import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Role } from '../../role/schemas/role.schema';
import { Token } from './token.schema';
import { SocialUser } from './social-user.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true, type: 'string', unique: true, max: 100 })
    email: string;

    @Prop({ type: 'string', max: 255 })
    password: string;

    @Prop({ type: 'number', default: 0 })
    wrong: number;

    @Prop({ type: 'string', default: 'Standard' })
    type: string;

    @Prop({ type: 'Date', default: null })
    blockTime: Date;

    @Prop({ required: true, type: 'string' })
    status: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
    role: Role;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Token' })
    token: Token;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SocialUser' }] })
    socials: SocialUser[];

    @Prop({type: 'Date', default: Date.now})
    created: Date;

    @Prop({type: 'Date', default: Date.now})
    updated: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
