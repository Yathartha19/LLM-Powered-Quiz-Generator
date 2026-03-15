import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { QuizService } from './quiz.service';

export interface QuizStepDto {
  quiz: any;
  qns: any[];
  userid: string;
}

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('create')
  create(@Body() body: Record<string, any>) {
    return this.quizService.create(body.name, body.description, body.creatorId);
  }

  @Post('delete')
  delete(@Body() body: Record<string, any>) {
    return this.quizService.delete(body.id, body.creatorId);
  }

  @Post('update')
  update(@Body() body: Record<string, any>) {
    return this.quizService.update(body.id, body.name, body.description, body.creatorId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizService.findOne(id);
  }

  @Post('next')
  next(@Body() body: QuizStepDto) {
  return this.quizService.next(
    body.quiz, 
    body.qns, 
    body.userid
  );
}
}
