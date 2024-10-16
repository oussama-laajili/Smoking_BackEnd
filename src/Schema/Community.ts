import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './User';

export type CommunityDocument = Community & Document;

@Schema()
export class Community {
    @Prop({ type: [Types.ObjectId], ref: 'User' }) // Reference to Challenge
    users: User[];
    
}

export const CommunitySchema = SchemaFactory.createForClass(Community);
