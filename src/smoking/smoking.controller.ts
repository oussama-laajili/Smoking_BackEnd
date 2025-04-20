import {
    Controller,
    Get,
    Post,
    Body,
    BadRequestException,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { SmokingService } from './smoking.service';
import { GeminiService } from './gemini.service';
  
  @Controller('smoking')
  export class SmokingController {
    constructor(
      private readonly smokingService: SmokingService,
      private readonly geminiService: GeminiService,
    ) {}
  
    @Get('predict-next')
    getPrediction() {
      const prediction = this.smokingService.predictNextCigarette();
      return {
        prediction: prediction || 'Not enough data to predict',
      };
    }
  
    @Post('advice')
    async getAdvice(@Body() body: any) {
      const requiredFields = ['timestamp', 'location', 'mood', 'triggerDescription'];
      const missing = requiredFields.filter((field) => !body[field]);
  
      if (missing.length) {
        throw new BadRequestException(`Missing required fields: ${missing.join(', ')}`);
      }
  
      const {
        timestamp,
        location,
        mood,
        wasAlone = false,
        hadAlcohol = false,
        triggerDescription,
        cravingIntensity = 5,
      } = body;
  
      const prompt = `As a smoking cessation expert, analyze this situation:
  **Context**
  - Time: ${timestamp}
  - Location: ${location}
  - Mood: ${mood}
  - Alone: ${wasAlone ? 'Yes' : 'No'}
  - Alcohol: ${hadAlcohol ? 'Yes' : 'No'}
  - Trigger: ${triggerDescription}
  - Craving Intensity: ${Math.min(Math.max(cravingIntensity, 1), 10)}/10
  
  **Response Requirements**
  - Return ONLY valid JSON (no markdown, no extra text)
  - Use exactly these categories with array values:
  {
      "immediateActions": ["action1", "action2"],
      "alternativeBehaviors": ["behavior1", "behavior2"],
      "longTermStrategies": ["strategy1", "strategy2"],
      "environmentalChanges": ["change1", "change2"],
      "stressReduction": ["technique1", "technique2"]
  }`;
  
      try {
        const structuredResponse = await this.geminiService.generateAdvice(prompt);
  
        return {
          recommendations: {
            immediate: structuredResponse.immediateActions || [],
            alternatives: structuredResponse.alternativeBehaviors || [],
            longTerm: structuredResponse.longTermStrategies || [],
            environment: structuredResponse.environmentalChanges || [],
            stressManagement: structuredResponse.stressReduction || [],
          },
          context: {
            timestamp,
            location,
            mood,
            trigger: triggerDescription,
            cravingIntensity: Math.min(Math.max(cravingIntensity, 1), 10),
          },
        };
      } catch (error) {
        throw new InternalServerErrorException({
          error: 'Failed to generate advice',
          details: error.message,
        });
      }
    }
  }
  