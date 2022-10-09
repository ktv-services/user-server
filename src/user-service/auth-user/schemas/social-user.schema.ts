import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SocialUserInterface } from '../interfaces/social-user.interface';

export type SocialUserDocument = SocialUser & Document;

@Schema()
export class SocialUser implements SocialUserInterface {
    @Prop({ required: true, type: 'string', max: 50 })
    id: string;

    @Prop({ required: true, type: 'string', max: 100 })
    email: string;

    @Prop({ required: true, type: 'string', max: 50 })
    firstName: string;

    @Prop({ required: true, type: 'string', max: 50 })
    lastName: string;

    @Prop({ required: true, type: 'string', max: 100 })
    photoUrl: string;

    @Prop({ required: true, type: 'string', max: 100 })
    provider: string;

    @Prop({ required: true, type: 'string' })
    status: string;

    @Prop({type: 'Date'})
    created: Date;

    @Prop({type: 'Date'})
    updated: Date;
}

export const SocialUserSchema = SchemaFactory.createForClass(SocialUser);
