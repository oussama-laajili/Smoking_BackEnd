import { IsArray, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCommunityDto {
  @IsArray()
  @IsOptional()
  users?: Types.ObjectId[];
}
