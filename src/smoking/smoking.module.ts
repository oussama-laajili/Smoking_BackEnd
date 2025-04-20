import { Module } from '@nestjs/common';
import { SmokingController } from './smoking.controller';
import { SmokingService } from './smoking.service';
import { GeminiService } from './gemini.service';

@Module({
  controllers: [SmokingController],
  providers: [SmokingService, GeminiService],
})
export class SmokingModule {}
