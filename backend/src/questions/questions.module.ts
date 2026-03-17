import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { Question } from './entities/questions.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attempt } from '../attempts/entities/attempt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attempt, Question])],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
