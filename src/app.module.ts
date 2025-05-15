import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // Replace with your DB host
      port: 5432, // Replace with your DB port
      username: 'postgres', // Replace with your DB username
      password: 'postgres', // Replace with your DB password
      database: 'postgres', // Replace with your DB name
      synchronize: true, // Auto-creates schema. Disable for production.
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
