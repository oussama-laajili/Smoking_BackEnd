import { IsString, IsNotEmpty } from 'class-validator';

export class CreateQuoteDto {
  @IsString()
  @IsNotEmpty()
  sujet: string;

  @IsString()
  @IsNotEmpty()
  text: string;
}
