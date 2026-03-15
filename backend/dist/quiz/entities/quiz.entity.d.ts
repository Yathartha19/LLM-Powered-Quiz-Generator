import { User } from '../../auth/entities/user.entity';
import { Attempt } from '../../attempts/entities/attempt.entity';
export declare class Quiz {
    id: string;
    name: string;
    description: string;
    creator: User;
    attempts: Attempt[];
}
