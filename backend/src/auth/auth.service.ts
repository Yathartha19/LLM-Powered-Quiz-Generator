import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async signup(name:string, email: string, pass: string) {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(pass, salt);

    const newUser = this.userRepository.create({ name, email, passwordHash });
    await this.userRepository.save(newUser);

    return { id: newUser.id, email: newUser.email, name: newUser.name };
  }

  async login(email: string, pass: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return { 
      success: true, 
      user: user.id, 
    };
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['quizzes'] });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { passwordHash, ...safeUserData } = user;
    return safeUserData; 
  }
}