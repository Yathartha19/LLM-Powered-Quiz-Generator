import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Attempt } from '../../attempts/entities/attempt.entity';

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @ManyToOne(() => User, user => user.quizzes )
  creator: User;

  @OneToMany(() => Attempt, attempt => attempt.quiz)
  attempts: Attempt[];
}