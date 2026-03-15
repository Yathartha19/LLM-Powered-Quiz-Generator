import { ConfigService } from '@nestjs/config';
export declare class GroqService {
    private configService;
    private groq;
    constructor(configService: ConfigService);
    getChatCompletion(prompt: string): Promise<string | null>;
}
