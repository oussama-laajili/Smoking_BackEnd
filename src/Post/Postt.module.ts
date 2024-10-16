import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Postt, PosttSchema } from '../Schema/Postt';
import { PosttController } from './Postt.controller';
import { PosttService } from './Postt.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Postt.name, schema: PosttSchema }]),
  ],
  controllers: [PosttController],
  providers: [PosttService],
  exports: [PosttService],
})
export class PosttModule {}
