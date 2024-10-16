import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../Schema/Article';
import { CreateArticleDto } from './Dto/CreateArticle.Dto';

@Injectable()
export class ArticleService {
  constructor(@InjectModel(Article.name) private articleModel: Model<ArticleDocument>) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const createdArticle = new this.articleModel(createArticleDto);
    return createdArticle.save();
  }

  async findAll(): Promise<Article[]> {
    return this.articleModel.find().exec();
  }

  async findById(id: string): Promise<Article | null> {
    return this.articleModel.findById(id).exec();
  }

  async update(id: string, updateArticleDto: CreateArticleDto): Promise<Article | null> {
    return this.articleModel.findByIdAndUpdate(id, updateArticleDto, { new: true }).exec();
  }

  async delete(id: string): Promise<Article | null> {
    return this.articleModel.findByIdAndDelete(id).exec();
  }
}
