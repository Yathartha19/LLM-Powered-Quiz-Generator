import { Quiz } from '../../quiz/entities/quiz.entity';
import { Attempt } from '../../attempts/entities/attempt.entity';
export declare class User {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    quizzes: Quiz[];
    attempts: Attempt[];
}
