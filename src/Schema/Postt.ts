import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PosttDocument = Postt & Document;

@Schema()
export class Postt {
    @Prop({ default: Date.now })
    title: string;

    @Prop({ required: true })
    text: string;

    @Prop({ default: Date.now }) // Automatically add creation date
    date: Date;

    
}

export const PosttSchema = SchemaFactory.createForClass(Postt);
