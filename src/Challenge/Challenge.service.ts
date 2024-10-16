import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge, ChallengeDocument } from '../Schema/Challenge';
import { CreateChallengeDto } from './Dto/CreateChallenge.Dto';

@Injectable()
export class ChallengeService {
  constructor(@InjectModel(Challenge.name) private challengeModel: Model<ChallengeDocument>) {}

  async create(createChallengeDto: CreateChallengeDto): Promise<Challenge> {
    const createdChallenge = new this.challengeModel(createChallengeDto);
    return createdChallenge.save();
  }

  async findAll(): Promise<Challenge[]> {
    return this.challengeModel.find().exec();
  }

  async findById(id: string): Promise<Challenge | null> {
    return this.challengeModel.findById(id).exec();
  }

  async update(id: string, updateChallengeDto: CreateChallengeDto): Promise<Challenge | null> {
    return this.challengeModel.findByIdAndUpdate(id, updateChallengeDto, { new: true }).exec();
  }

  async delete(id: string): Promise<Challenge | null> {
    return this.challengeModel.findByIdAndDelete(id).exec();
  }
}
