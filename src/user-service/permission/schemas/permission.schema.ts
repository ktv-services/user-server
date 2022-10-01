import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PermissionDto } from '../dtos/permission.dto';

export type PermissionDocument = Permission & Document;

@Schema()
export class Permission implements PermissionDto {
    @Prop({ required: true, type: 'string' })
    name: string;

    @Prop({ required: true, type: 'string' })
    status: string;

    @Prop({type: 'Date'})
    created: Date;

    @Prop({type: 'Date'})
    updated: Date;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
