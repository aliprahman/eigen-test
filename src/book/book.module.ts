import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BookModel } from './model/book.model';
import { BookController } from './controller/book.controller';
import { BookService } from './service/book.service';

@Module({
  imports: [SequelizeModule.forFeature([BookModel])],
  providers: [BookService],
  controllers: [BookController],
  exports: [SequelizeModule],
})
export class BookModule {}
