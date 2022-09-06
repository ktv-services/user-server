import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Permission } from '../../permission/schemas/permission.schema';

export type RoleDocument = Role & Document;

@Schema()
export class Role {
    @Prop({ required: true, type: 'string' })
    name: string;

    @Prop({ required: true, type: 'string' })
    status: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }] })
    permissions: Permission[];

    @Prop({type: 'Date'})
    created: Date;

    @Prop({type: 'Date'})
    updated: Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
