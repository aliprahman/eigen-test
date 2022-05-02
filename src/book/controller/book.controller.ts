import { Controller, Get } from '@nestjs/common';
import { BookService } from '../service/book.service';
import { BookModel } from '../model/book.model';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  async findAll(): Promise<BookModel[]> {
    return this.bookService.findAll();
  }
}
