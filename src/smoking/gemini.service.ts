import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GeminiService {
  private readonly GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent';
  private readonly API_KEY = "AIzaSyCqTpA_yFBxOAEuETe92yHvs5g1UVX0728";

  async generateAdvice(prompt: string): Promise<any> {
    const response = await axios.post(
      this.GEMINI_URL,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        params: { key: this.API_KEY },
        headers: { 'Content-Type': 'application/json' },
      },
    );

    let text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    let structuredResponse;
    try {
      structuredResponse = JSON.parse(text);
    } catch (error) {
      throw new Error('Failed to parse AI response');
    }

    const requiredSections = [
      'immediateActions',
      'alternativeBehaviors',
      'longTermStrategies',
    ];

    for (const section of requiredSections) {
      if (!Array.isArray(structuredResponse[section])) {
        throw new Error(`${section} must be an array`);
      }
    }

    return structuredResponse;
  }
}
