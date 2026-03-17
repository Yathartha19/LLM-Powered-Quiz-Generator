import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { Attempt } from '../../attempts/entities/attempt.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  question: string;

  @Column({ type: 'jsonb' })
  options: string[];
  
  @Column()
  correctOption: string;

  @Column()
  userAnswer: string;

  @Column()
  isCorrect: boolean;

  @ManyToOne(() => Attempt, attempt => attempt.questions)
  attempt: Attempt;

  @CreateDateColumn()
  startedAt: Date;
}