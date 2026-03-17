import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Attempt } from '../attempts/entities/attempt.entity';
import { Question } from './entities/questions.entity';

@Injectable()
export class QuestionsService {

  constructor(
        @InjectRepository(Attempt)
        private attemptsRepository: Repository<Attempt>, 
  
        @InjectRepository(Question)
        private questionsRepository: Repository<Question>,
      ) {}
    
    async create(questions: string, options: string[], correctOption: string, userAnswer: string, isCorrect: boolean, attemptId: string) {
      const attempt = await this.attemptsRepository.findOne({ where: { id: attemptId } });
      if (!attempt) throw new Error('Attempt not found');
  
      const newQuestion = this.questionsRepository.create({ question: questions, options, correctOption, userAnswer, isCorrect, attempt });
      await this.questionsRepository.save(newQuestion);
    }

    async findForAttempt(attemptId: string) {
      return this.questionsRepository.find({ where: { attempt: { id: attemptId } }, relations: ['attempt'] });
    }
}
