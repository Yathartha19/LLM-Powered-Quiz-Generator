import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Quiz } from '../../quiz/entities/quiz.entity';

@Entity('attempts')
export class Attempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.attempts)
  user: User;

  @ManyToOne(() => Quiz, quiz => quiz.attempts)
  quiz: Quiz;

  @Column({ default: 0 })
  score: number;

  @CreateDateColumn()
  startedAt: Date;
}