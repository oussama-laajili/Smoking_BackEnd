import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../Schema/User';
import { UserController } from './User.controller';
import { UserService } from './User.service';
import { MailModule } from 'src/Mail/Mail.module';
import { Challenge, ChallengeSchema } from '../Schema/Challenge'; // Import Challenge schema
import { Postt, PosttSchema } from 'src/Schema/Postt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: Challenge.name, schema: ChallengeSchema },{ name: Postt.name, schema: PosttSchema }]), // Add Challenge schema here
    MailModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
