import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { QuoteService } from './Quote.service';
import { CreateQuoteDto } from './Dto/CreateQuote.Dto';
import { Quote } from '../Schema/Quote';

@Controller('quotes')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Post()
  async create(@Body() createQuoteDto: CreateQuoteDto): Promise<Quote> {
    return this.quoteService.create(createQuoteDto);
  }

  @Get()
  async findAll(): Promise<Quote[]> {
    return this.quoteService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Quote | null> {
    return this.quoteService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateQuoteDto: CreateQuoteDto): Promise<Quote | null> {
    return this.quoteService.update(id, updateQuoteDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Quote | null> {
    return this.quoteService.delete(id);
  }
}
