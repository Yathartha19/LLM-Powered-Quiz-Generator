import { Repository } from 'typeorm';
import { Quiz } from '../quiz/entities/quiz.entity';
import { Attempt } from './entities/attempt.entity';
import { User } from '../auth/entities/user.entity';
export declare class AttemptsService {
    private quizRepository;
    private attemptsRepository;
    private userRepository;
    constructor(quizRepository: Repository<Quiz>, attemptsRepository: Repository<Attempt>, userRepository: Repository<User>);
    create(userId: string, quizId: string, score: number): Promise<(string | Quiz | null)[]>;
}
