import { Attempt } from '../../attempts/entities/attempt.entity';
export declare class Question {
    id: string;
    question: string;
    options: string[];
    correctOption: string;
    userAnswer: string;
    isCorrect: boolean;
    attempt: Attempt;
    startedAt: Date;
}
