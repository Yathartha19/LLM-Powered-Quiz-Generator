import { User } from '../../auth/entities/user.entity';
import { Quiz } from '../../quiz/entities/quiz.entity';
export declare class Attempt {
    id: string;
    user: User;
    quiz: Quiz;
    score: number;
    startedAt: Date;
}
