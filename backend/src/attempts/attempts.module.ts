import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attempt } from './entities/attempt.entity';
import { AttemptsService } from './attempts.service';
import { AttemptsController } from './attempts.controller';
import { Quiz } from '../quiz/entities/quiz.entity';
import { User } from '../auth/entities/user.entity';
import { Question } from '../questions/entities/questions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attempt, Quiz, User, Question])],
  controllers: [AttemptsController],
  providers: [AttemptsService],
})
export class AttemptsModule {}