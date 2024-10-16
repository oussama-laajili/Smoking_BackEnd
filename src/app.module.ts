import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './User/User.module';
import { QuoteModule } from './Quote/Quote.module';
import { PosttModule } from './Post/Postt.module';
import { ArticleModule } from './Article/Article.module';
import { CommunityModule } from './Community/Community.module';
import { ChallengeModule } from './Challenge/Challenge.module';
import { MailModule } from './Mail/Mail.module';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/Smoking_APP'), // Replace with your MongoDB connection string
    ScheduleModule.forRoot(),
    UserModule,
    QuoteModule,
    PosttModule,
    ArticleModule,
    CommunityModule,
    ChallengeModule,
    MailModule

  ],
})
export class AppModule {}
