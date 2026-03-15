import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(body: Record<string, any>): Promise<{
        id: string;
        email: string;
        name: string;
    }>;
    login(body: Record<string, any>): Promise<{
        success: boolean;
        user: string;
    }>;
    getUser(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        quizzes: import("../quiz/entities/quiz.entity").Quiz[];
        attempts: import("../attempts/entities/attempt.entity").Attempt[];
    }>;
}
