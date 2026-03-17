import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; 
import { Quiz } from './entities/quiz.entity';
import { User } from '../auth/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Attempt } from '../attempts/entities/attempt.entity';
import { Question } from '../questions/entities/questions.entity';
import Groq from 'groq-sdk';

@Injectable()
export class QuizService {
  private groq: Groq;

  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Attempt)
    private attemptsRepository: Repository<Attempt>,

    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,

    private configService: ConfigService,
  ) {
    this.groq = new Groq({
      apiKey: this.configService.get<string>('GROQ_API_KEY'),
    });
  }

  async create(name: string, description: string, creatorId: string ) {
    const user = await this.userRepository.findOne({ where: { id: creatorId } });
    if (!user) throw new Error('User not found');

    const newQuiz = this.quizRepository.create({ name, description, creator: user });
    await this.quizRepository.save(newQuiz);

    const data = await this.userRepository.findOne({ 
      where: { id: creatorId }, 
      relations: ['quizzes'] 
    });

    return data?.quizzes;
  }

  async delete(id: string, creatorId: string) {
    const quiz = await this.quizRepository.findOne({ where: { id } });
    if (!quiz) throw new Error('Quiz not found');

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

  async update(id: string, name: string, description: string, creatorId: string) {
    const quiz = await this.quizRepository.findOne({ where: { id } });
    if (!quiz) throw new Error('Quiz not found');

    quiz.name = name;
    quiz.description = description;
    await this.quizRepository.save(quiz);

    const data = await this.userRepository.findOne({ 
      where: { id: creatorId }, 
      relations: ['quizzes'] 
    });

    return data?.quizzes;
  }

  async findOne(id: string) {
    const quiz = await this.quizRepository.findOne({ where: { id }, relations: ['attempts', 'attempts.user'] });
    if (!quiz) throw new Error('Quiz not found');
    return quiz;
  }

  async next(quizData: any, questions: any[], userId: string) {

    let userPrompt = '';
    if (questions.length === 0) {
      userPrompt = `Generate the first question based on: ${quizData.description}.`;
    } else {
      userPrompt = `Based on these past questions: ${JSON.stringify(questions)}, generate a new follow-up question. Adapt this new question's difficulty based on the previous questions and useranswers.`;
    }

    try {
      const completion = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: `You are a quiz assistant. Return ONLY a JSON object with the key "new_question". 
            Format: {"new_question": {"id": "int incrementing from 0 ", "question": "text", "options": ["a", "b", "c", "d"], "answer": "text", "userAnswer": "ALWAYS LEAVE THIS EMPTY", "isCorrect": false}}`,
          },
          { role: 'user', content: userPrompt },
        ],
      });

      const content = JSON.parse(completion.choices[0]?.message?.content || '{}');
      const newQuestion = content.new_question;

      return [...questions, newQuestion];

    } catch (error) {
      console.error('Groq Error:', error);
      throw new Error('Failed to generate quiz step');
    }
  }
}
