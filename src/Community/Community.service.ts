import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Community, CommunityDocument } from '../Schema/Community';
import { CreateCommunityDto } from './Dto/CreateCommunity.Dto';

@Injectable()
export class CommunityService {
  constructor(@InjectModel(Community.name) private communityModel: Model<CommunityDocument>) {}

  async create(createCommunityDto: CreateCommunityDto): Promise<Community> {
    const createdCommunity = new this.communityModel(createCommunityDto);
    return createdCommunity.save();
  }

  async findAll(): Promise<Community[]> {
    return this.communityModel.find().populate('users').exec(); // Populate users
  }

  async findById(id: string): Promise<Community | null> {
    return this.communityModel.findById(id).populate('users').exec(); // Populate users
  }

  async update(id: string, updateCommunityDto: CreateCommunityDto): Promise<Community | null> {
    return this.communityModel.findByIdAndUpdate(id, updateCommunityDto, { new: true }).exec();
  }

  async delete(id: string): Promise<Community | null> {
    return this.communityModel.findByIdAndDelete(id).exec();
  }
}
