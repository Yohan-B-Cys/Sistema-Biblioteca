import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Logs } from './entities/log.entity';
import { History } from './entities/history.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
      type: 'better-sqlite3' ,
      database: 'banco-de-dados.sqlite', 
      autoLoadEntities: true, 
      synchronize: true, 
    }),
  TypeOrmModule.forFeature([Book]),
  TypeOrmModule.forFeature([Logs]),
  TypeOrmModule.forFeature([History]),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
