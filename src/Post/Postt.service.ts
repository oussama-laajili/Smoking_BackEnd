import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Postt, PosttDocument } from '../Schema/Postt';
import { CreatePosttDto } from './Dto/CreatePostt.Dto';

@Injectable()
export class PosttService {
  constructor(@InjectModel(Postt.name) private posttModel: Model<PosttDocument>) {}

  async create(createPosttDto: CreatePosttDto): Promise<Postt> {
    const createdPostt = new this.posttModel(createPosttDto);
    return createdPostt.save();
  }

  async findAll(): Promise<Postt[]> {
    return this.posttModel.find().exec();
  }

  async findById(id: string): Promise<Postt | null> {
    return this.posttModel.findById(id).exec();
  }

  async update(id: string, updatePosttDto: CreatePosttDto): Promise<Postt | null> {
    return this.posttModel.findByIdAndUpdate(id, updatePosttDto, { new: true }).exec();
  }

  async delete(id: string): Promise<Postt | null> {
    return this.posttModel.findByIdAndDelete(id).exec();
  }
}
