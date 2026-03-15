import { QuizService } from './quiz.service';
export interface QuizStepDto {
    quiz: any;
    qns: any[];
    userid: string;
}
export declare class QuizController {
    private readonly quizService;
    constructor(quizService: QuizService);
    create(body: Record<string, any>): Promise<import("./entities/quiz.entity").Quiz[] | undefined>;
    delete(body: Record<string, any>): Promise<import("./entities/quiz.entity").Quiz[] | undefined>;
    update(body: Record<string, any>): Promise<import("./entities/quiz.entity").Quiz[] | undefined>;
    findOne(id: string): Promise<import("./entities/quiz.entity").Quiz>;
    next(body: QuizStepDto): Promise<any[]>;
}
