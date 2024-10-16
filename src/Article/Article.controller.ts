import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ArticleService } from './Article.service';
import { CreateArticleDto } from './Dto/CreateArticle.Dto';
import { Article } from '../Schema/Article';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  async create(@Body() createArticleDto: CreateArticleDto): Promise<Article> {
    return this.articleService.create(createArticleDto);
  }

  @Get()
  async findAll(): Promise<Article[]> {
    return this.articleService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Article | null> {
    return this.articleService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateArticleDto: CreateArticleDto): Promise<Article | null> {
    return this.articleService.update(id, updateArticleDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Article | null> {
    return this.articleService.delete(id);
  }
}
