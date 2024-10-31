import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChallengeDocument = Challenge & Document;

@Schema()
export class Challenge {
    @Prop({ default: Date.now })
    dateactuel: Date;

    @Prop({ required: true, min: 0 })  // Enforces non-negative values
    nbexpeccig: number;

    @Prop({ required: true, min: 0 })  // Enforces non-negative values
    nbcigsmoked: number;

    @Prop({ required: true })
    timebtwcig: number;

    @Prop({ required: true })
    challengesucc: boolean;
    
    _id: any;
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
