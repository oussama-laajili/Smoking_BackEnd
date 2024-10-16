import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PosttService } from './Postt.service';
import { CreatePosttDto } from './Dto/CreatePostt.Dto';
import { Postt } from '../Schema/Postt';

@Controller('postts')
export class PosttController {
  constructor(private readonly posttService: PosttService) {}

  @Post()
  async create(@Body() createPosttDto: CreatePosttDto): Promise<Postt> {
    return this.posttService.create(createPosttDto);
  }

  @Get()
  async findAll(): Promise<Postt[]> {
    return this.posttService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Postt | null> {
    return this.posttService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePosttDto: CreatePosttDto): Promise<Postt | null> {
    return this.posttService.update(id, updatePosttDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Postt | null> {
    return this.posttService.delete(id);
  }
}
