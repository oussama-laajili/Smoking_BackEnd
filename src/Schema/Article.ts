import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArticleDocument = Article & Document;

@Schema()
export class Article {
    @Prop({ default: Date.now })
    sujet: string;

    @Prop({ required: true })
    text: string;

    

    @Prop({ required: true })
    auteur: string;

    
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
