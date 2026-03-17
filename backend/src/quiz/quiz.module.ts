import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { User } from 'src/auth/entities/user.entity';
import { Attempt } from 'src/attempts/entities/attempt.entity';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { Question } from 'src/questions/entities/questions.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Quiz, User, Attempt, Question]), ConfigModule,],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
