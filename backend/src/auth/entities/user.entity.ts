import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Quiz } from '../../quiz/entities/quiz.entity';
import { Attempt } from '../../attempts/entities/attempt.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string; // Never store plain text!

  @OneToMany(() => Quiz, quiz => quiz.creator)
  quizzes: Quiz[];

  @OneToMany(() => Attempt, attempt => attempt.user)
  attempts: Attempt[];
}