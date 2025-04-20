import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config'; // Add this import
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './User/User.module';
import { QuoteModule } from './Quote/Quote.module';
import { PosttModule } from './Post/Postt.module';
import { ArticleModule } from './Article/Article.module';
import { CommunityModule } from './Community/Community.module';
import { ChallengeModule } from './Challenge/Challenge.module';
import { MailModule } from './Mail/Mail.module';
import { AuthModule } from './Auth/auth.module';
import { SmokingModule } from './smoking/smoking.module';
// import { SmokingModule } from './smoking/smoking.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Add ConfigModule globally
    MongooseModule.forRoot('mongodb://localhost/Smoking_APP'), // MongoDB connection
    ScheduleModule.forRoot(),
    UserModule,
    QuoteModule,
    PosttModule,
    ArticleModule,
    CommunityModule,
    ChallengeModule,
    AuthModule,
    MailModule,
    SmokingModule
    ],
})
export class AppModule {}