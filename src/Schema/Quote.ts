import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuoteDocument = Quote & Document;

@Schema()
export class Quote {
    @Prop({ default: Date.now })
    sujet: string;

    @Prop({ required: true })
    text: string;
    
}

export const QuoteSchema = SchemaFactory.createForClass(Quote);
