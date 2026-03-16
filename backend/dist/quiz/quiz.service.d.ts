import { Repository } from 'typeorm';
import { Quiz } from './entities/quiz.entity';
import { User } from '../auth/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Attempt } from '../attempts/entities/attempt.entity';
export declare class QuizService {
    private quizRepository;
    private userRepository;
    private attemptsRepository;
    private configService;
    private groq;
    constructor(quizRepository: Repository<Quiz>, userRepository: Repository<User>, attemptsRepository: Repository<Attempt>, configService: ConfigService);
    create(name: string, description: string, creatorId: string): Promise<Quiz[] | undefined>;
    delete(id: string, creatorId: string): Promise<Quiz[] | undefined>;
    update(id: string, name: string, description: string, creatorId: string): Promise<Quiz[] | undefined>;
    findOne(id: string): Promise<Quiz>;
    next(quizData: any, questions: any[], userId: string): Promise<any[]>;
}
