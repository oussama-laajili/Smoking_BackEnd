import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class CreatePosttDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsDate()
  @IsNotEmpty()
  date: Date;

}
