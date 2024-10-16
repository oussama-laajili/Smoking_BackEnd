import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CommunityService } from './Community.service';
import { CreateCommunityDto } from './Dto/CreateCommunity.Dto';
import { Community } from '../Schema/Community';

@Controller('communities')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Post()
  async create(@Body() createCommunityDto: CreateCommunityDto): Promise<Community> {
    return this.communityService.create(createCommunityDto);
  }

  @Get()
  async findAll(): Promise<Community[]> {
    return this.communityService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Community | null> {
    return this.communityService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCommunityDto: CreateCommunityDto): Promise<Community | null> {
    return this.communityService.update(id, updateCommunityDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Community | null> {
    return this.communityService.delete(id);
  }
}
