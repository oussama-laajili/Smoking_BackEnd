import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quote, QuoteDocument } from '../Schema/Quote';
import { CreateQuoteDto } from './Dto/CreateQuote.Dto';

@Injectable()
export class QuoteService {
  constructor(@InjectModel(Quote.name) private quoteModel: Model<QuoteDocument>) {}

  async create(createQuoteDto: CreateQuoteDto): Promise<Quote> {
    const createdQuote = new this.quoteModel(createQuoteDto);
    return createdQuote.save();
  }

  async findAll(): Promise<Quote[]> {
    return this.quoteModel.find().exec();
  }

  async findById(id: string): Promise<Quote | null> {
    return this.quoteModel.findById(id).exec();
  }

  async update(id: string, updateQuoteDto: CreateQuoteDto): Promise<Quote | null> {
    return this.quoteModel.findByIdAndUpdate(id, updateQuoteDto, { new: true }).exec();
  }

  async delete(id: string): Promise<Quote | null> {
    return this.quoteModel.findByIdAndDelete(id).exec();
  }
}
