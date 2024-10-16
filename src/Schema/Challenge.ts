import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChallengeDocument = Challenge & Document;

@Schema()
export class Challenge {
    @Prop({ default: Date.now })
    dateactuel: Date;

    @Prop({ required: true })
    nbexpeccig: number;

    @Prop({ required: true })
    nbcigsmoked: number;

    @Prop({ required: true })
    timebtwcig: number;

    @Prop({ required: true })
    challengesucc: boolean;
  _id: any;
    
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
