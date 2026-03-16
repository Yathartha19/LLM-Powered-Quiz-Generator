import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from '../quiz/entities/quiz.entity';
import { Attempt } from './entities/attempt.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class AttemptsService {

  constructor(
      @InjectRepository(Quiz)
      private quizRepository: Repository<Quiz>,

      @InjectRepository(Attempt)
      private attemptsRepository: Repository<Attempt>, 

      @InjectRepository(User)
      private userRepository: Repository<User>,
    ) {}
  
  async create(userId: string, quizId: string, score: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const quiz = await this.quizRepository.findOne({ where: { id: quizId } });
    if (!quiz) throw new Error('Quiz not found');

    const newAttempt = this.attemptsRepository.create({ user: user, quiz: quiz, score });
    await this.attemptsRepository.save(newAttempt);

    const data = await this.quizRepository.findOne({ 
      where: { id: quizId }, 
      relations: ['attempts', 'attempts.user'] 
    });

    return data;
  }

}
