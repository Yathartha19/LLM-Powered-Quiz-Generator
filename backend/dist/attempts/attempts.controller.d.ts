import { AttemptsService } from './attempts.service';
export declare class AttemptsController {
    private readonly attemptsService;
    constructor(attemptsService: AttemptsService);
    create(body: Record<string, any>): Promise<(string | import("../quiz/entities/quiz.entity").Quiz | null)[]>;
}
