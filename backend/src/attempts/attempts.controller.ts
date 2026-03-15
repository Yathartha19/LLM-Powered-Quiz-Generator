import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AttemptsService } from './attempts.service';

@Controller('attempts')
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @Post('create')
  create(@Body() body: Record<string, any>) {
    return this.attemptsService.create(body.userId, body.quizId, body.score);
  }
}
