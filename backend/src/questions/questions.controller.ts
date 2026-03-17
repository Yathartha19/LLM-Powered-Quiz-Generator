import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}
  
    @Post('create')
    create(@Body() body: Record<string, any>) {
      return this.questionsService.create(body.question, body.options, body.correctOption, body.userAnswer, body.isCorrect, body.attemptId);
    }

    @Post('get')
    findForAttempt(@Body() body: Record<string, any>) {
      return this.questionsService.findForAttempt(body.attemptId);
    }
}
