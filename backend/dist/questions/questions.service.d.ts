import { Repository } from 'typeorm';
import { Attempt } from '../attempts/entities/attempt.entity';
import { Question } from './entities/questions.entity';
export declare class QuestionsService {
    private attemptsRepository;
    private questionsRepository;
    constructor(attemptsRepository: Repository<Attempt>, questionsRepository: Repository<Question>);
    create(questions: string, options: string[], correctOption: string, userAnswer: string, isCorrect: boolean, attemptId: string): Promise<void>;
    findForAttempt(attemptId: string): Promise<Question[]>;
}
