import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

import * as dotenv from 'dotenv';
dotenv.config()

@Module({
  imports: [AuthModule, SequelizeModule.forRoot({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    autoLoadModels: true,
    // sync:{alter:true}
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
