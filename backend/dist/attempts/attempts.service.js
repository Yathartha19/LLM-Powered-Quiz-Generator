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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttemptsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const quiz_entity_1 = require("../quiz/entities/quiz.entity");
const attempt_entity_1 = require("./entities/attempt.entity");
const user_entity_1 = require("../auth/entities/user.entity");
let AttemptsService = class AttemptsService {
    quizRepository;
    attemptsRepository;
    userRepository;
    constructor(quizRepository, attemptsRepository, userRepository) {
        this.quizRepository = quizRepository;
        this.attemptsRepository = attemptsRepository;
        this.userRepository = userRepository;
    }
    async create(userId, quizId, score) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user)
            throw new Error('User not found');
        const quiz = await this.quizRepository.findOne({ where: { id: quizId } });
        if (!quiz)
            throw new Error('Quiz not found');
        const newAttempt = this.attemptsRepository.create({ user: user, quiz: quiz, score });
        await this.attemptsRepository.save(newAttempt);
        const data = await this.quizRepository.findOne({
            where: { id: quizId },
            relations: ['attempts']
        });
        return data;
    }
};
exports.AttemptsService = AttemptsService;
exports.AttemptsService = AttemptsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(quiz_entity_1.Quiz)),
    __param(1, (0, typeorm_2.InjectRepository)(attempt_entity_1.Attempt)),
    __param(2, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], AttemptsService);
//# sourceMappingURL=attempts.service.js.map