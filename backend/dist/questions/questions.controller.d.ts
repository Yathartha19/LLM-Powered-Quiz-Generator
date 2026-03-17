import { QuestionsService } from './questions.service';
export declare class QuestionsController {
    private readonly questionsService;
    constructor(questionsService: QuestionsService);
    create(body: Record<string, any>): Promise<void>;
    findForAttempt(body: Record<string, any>): Promise<import("./entities/questions.entity").Question[]>;
}
