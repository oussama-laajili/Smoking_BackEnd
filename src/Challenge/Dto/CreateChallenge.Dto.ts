import { IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateChallengeDto {
  @IsOptional()
  dateactuel?: Date;

  @IsNumber()
  nbexpeccig: number;

  @IsNumber()
  nbcigsmoked: number;

  @IsNumber()
  timebtwcig: number;

  @IsBoolean()
  challengesucc: boolean;
}
