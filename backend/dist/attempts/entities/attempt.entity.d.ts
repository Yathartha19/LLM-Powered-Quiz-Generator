import { User } from '../../auth/entities/user.entity';
import { Quiz } from '../../quiz/entities/quiz.entity';
import { Question } from '../../questions/entities/questions.entity';
export declare class Attempt {
    id: string;
    user: User;
    quiz: Quiz;
    score: number;
    questions: Question;
    startedAt: Date;
}
