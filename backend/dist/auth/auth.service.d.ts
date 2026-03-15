import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class AuthService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    signup(name: string, email: string, pass: string): Promise<{
        id: string;
        email: string;
        name: string;
    }>;
    login(email: string, pass: string): Promise<{
        success: boolean;
        user: string;
    }>;
    getUserById(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        quizzes: import("../quiz/entities/quiz.entity").Quiz[];
        attempts: import("../attempts/entities/attempt.entity").Attempt[];
    }>;
}
