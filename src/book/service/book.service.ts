import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BookModel } from '../model/book.model';
import { Op } from 'sequelize';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(BookModel)
    private bookModel: typeof BookModel,
  ) {}

  async findAll(): Promise<BookModel[]> {
    return this.bookModel.findAll({
      where: {
        stock: {
          [Op.gt]: 0,
        },
      },
    });
  }

  async findByCode(code: string): Promise<BookModel> {
    return this.bookModel.findOne({
      where: {
        code,
      },
    });
  }
}
