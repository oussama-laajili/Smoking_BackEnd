import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ChallengeService } from './Challenge.service';
import { CreateChallengeDto } from './Dto/CreateChallenge.Dto';
import { Challenge } from '../Schema/Challenge';

@Controller('challenges')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Post()
  async create(@Body() createChallengeDto: CreateChallengeDto): Promise<Challenge> {
    return this.challengeService.create(createChallengeDto);
  }

  @Get()
  async findAll(): Promise<Challenge[]> {
    return this.challengeService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Challenge | null> {
    return this.challengeService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateChallengeDto: CreateChallengeDto): Promise<Challenge | null> {
    return this.challengeService.update(id, updateChallengeDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Challenge | null> {
    return this.challengeService.delete(id);
  }
}
