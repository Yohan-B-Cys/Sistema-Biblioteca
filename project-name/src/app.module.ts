import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
      type: 'better-sqlite3' ,
      database: 'banco-de-dados.sqlite', 
      autoLoadEntities: true, 
      synchronize: true, 
    }),
  TypeOrmModule.forFeature([Book]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
