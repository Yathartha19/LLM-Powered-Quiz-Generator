"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const quiz_entity_1 = require("./entities/quiz.entity");
const user_entity_1 = require("../auth/entities/user.entity");
const config_1 = require("@nestjs/config");
const attempt_entity_1 = require("../attempts/entities/attempt.entity");
const questions_entity_1 = require("../questions/entities/questions.entity");
const groq_sdk_1 = __importDefault(require("groq-sdk"));
let QuizService = class QuizService {
    quizRepository;
    userRepository;
    attemptsRepository;
    questionsRepository;
    configService;
    groq;
    constructor(quizRepository, userRepository, attemptsRepository, questionsRepository, configService) {
        this.quizRepository = quizRepository;
        this.userRepository = userRepository;
        this.attemptsRepository = attemptsRepository;
        this.questionsRepository = questionsRepository;
        this.configService = configService;
        this.groq = new groq_sdk_1.default({
            apiKey: this.configService.get('GROQ_API_KEY'),
        });
    }
    async create(name, description, creatorId) {
        const user = await this.userRepository.findOne({ where: { id: creatorId } });
        if (!user)
            throw new Error('User not found');
        const newQuiz = this.quizRepository.create({ name, description, creator: user });
        await this.quizRepository.save(newQuiz);
        const data = await this.userRepository.findOne({
            where: { id: creatorId },
            relations: ['quizzes']
        });
        return data?.quizzes;
    }
    async delete(id, creatorId) {
        const quiz = await this.quizRepository.findOne({ where: { id } });
        if (!quiz)
            throw new Error('Quiz not found');
        const attempts = await this.attemptsRepository.find({ where: { quiz: { id } } });
        for (const attempt of attempts) {
            const questions = await this.questionsRepository.find({ where: { attempt: { id: attempt.id } } });
            await this.questionsRepository.remove(questions);
        }
        await this.attemptsRepository.remove(attempts);
        await this.quizRepository.remove(quiz);
        const data = await this.userRepository.findOne({
            where: { id: creatorId },
            relations: ['quizzes']
        });
        return data?.quizzes;
    }
    async update(id, name, description, creatorId) {
        const quiz = await this.quizRepository.findOne({ where: { id } });
        if (!quiz)
            throw new Error('Quiz not found');
        quiz.name = name;
        quiz.description = description;
        await this.quizRepository.save(quiz);
        const data = await this.userRepository.findOne({
            where: { id: creatorId },
            relations: ['quizzes']
        });
        return data?.quizzes;
    }
    async findOne(id) {
        const quiz = await this.quizRepository.findOne({ where: { id }, relations: ['attempts', 'attempts.user'] });
        if (!quiz)
            throw new Error('Quiz not found');
        return quiz;
    }
    async next(quizData, questions, userId) {
        let userPrompt = '';
        if (questions.length === 0) {
            userPrompt = `Generate the first question based on: ${quizData.description}.`;
        }
        else {
            userPrompt = `Based on these past questions: ${JSON.stringify(questions)}, generate a new follow-up question.`;
        }
        try {
            const completion = await this.groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                response_format: { type: 'json_object' },
                messages: [
                    {
                        role: 'system',
                        content: `You are a quiz assistant. Return ONLY a JSON object with the key "new_question". 
            Format: {"new_question": {"id": "int incrementing from 0 ", "question": "text", "options": ["a", "b", "c", "d"], "answer": "text", "isCorrect": false}}`,
                    },
                    { role: 'user', content: userPrompt },
                ],
            });
            const content = JSON.parse(completion.choices[0]?.message?.content || '{}');
            const newQuestion = content.new_question;
            return [...questions, newQuestion];
        }
        catch (error) {
            console.error('Groq Error:', error);
            throw new Error('Failed to generate quiz step');
        }
    }
};
exports.QuizService = QuizService;
exports.QuizService = QuizService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(quiz_entity_1.Quiz)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(attempt_entity_1.Attempt)),
    __param(3, (0, typeorm_1.InjectRepository)(questions_entity_1.Question)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService])
], QuizService);
//# sourceMappingURL=quiz.service.js.map