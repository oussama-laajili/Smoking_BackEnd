import { IsString, IsEmail, IsDate, IsNumber, IsArray, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserDto {
  @IsString()
  nom: string;

  @IsString()
  prenom: string;

  @IsEmail()
  email: string;

  @IsDate()
  @IsOptional()
  dob?: Date;

  @IsString()
  sexe: string;

  @IsDate()
  @IsOptional()
  datedebut?: Date;

  @IsNumber()
  nbcigaretteinitial: number;

  @IsNumber()
  prixcig: number;

  @IsArray()
  @IsString({ each: true })
  raisonsmoking: string[];

  @IsArray()
  @IsString({ each: true })
  raisonstopsmoking: string[];

  @IsNumber()
  compteurargent: number;

  @IsNumber()
  compteurcig: number;

  @IsNumber()
  totalcig: number;

  @IsNumber()
  compteurpts: number;

  @IsArray()
  @IsOptional()
  challenges?: Types.ObjectId[];

  @IsArray()
  @IsOptional()
  posts?: Types.ObjectId[];

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  resetToken?: string;

  @IsDate()
  @IsOptional()
  resetTokenExpiration?: Date;
}
