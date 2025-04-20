import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Challenge } from './Challenge';
import { Postt } from './Postt';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true })
    nom: string;
  
    @Prop({ required: true })
    prenom: string;
    
    @Prop({ required: true })
    email: string;

    @Prop({ default: Date.now })
    dob: Date;
  
    @Prop({ required: true })
    sexe: string;

    @Prop({ default: Date.now })
    datedebut: Date;

    @Prop({ required: true })
    nbcigaretteinitial: number;

    @Prop({ required: true })
    prixcig: number;

    @Prop({ required: true, type: [String] }) // Specify that preference is an array of strings
    raisonsmoking: string[];

    @Prop({ required: true, type: [String] }) // Specify that preference is an array of strings
    raisonstopsmoking: string[];

    @Prop({ required: true })
    compteurargent: number;

    @Prop({ required: true })
    compteurcig: number;

    @Prop({ required: true })
    compteurpts: number;

    @Prop({ type: [Types.ObjectId], ref: 'Challenge' }) // Reference to Challenge
    challenges: Challenge[];

    @Prop({ type: [Types.ObjectId], ref: 'Postt' }) // Reference to Challenge
    posts: Postt[];

    @Prop({ required: true })
    password: string;
    @Prop()
    resetToken: string; // Path to the image file
  
    @Prop({ required: false })
    resetTokenExpiration: Date;

    @Prop({ required: false })
    totalcig: number;


    @Prop({ required: false })
    time_of_latest_cig: Date;

    @Prop({ type: [SchemaTypes.Date], required: false })
    time_for_all_cig: Date[];


}


export const UserSchema = SchemaFactory.createForClass(User);
