import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizModule } from './quiz/quiz.module';
import { AuthModule } from './auth/auth.module';
import { AttemptsModule } from './attempts/attempts.module';
import { QuestionsModule } from './questions/questions.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'dist'),
      exclude: ['/api/*path'], 
    }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('NEON_URL'),
        
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
        
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    QuizModule,
    AuthModule,
    AttemptsModule,
    QuestionsModule

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}