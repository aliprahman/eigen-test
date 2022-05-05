import { Controller, Get } from '@nestjs/common';
import { BookService } from '../service/book.service';
import { BookModel } from '../model/book.model';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
@ApiTags('Book')
@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  @ApiOkResponse({
    description: 'success get list book',
    schema: {
      example: [
        {
          id: 1,
          code: 'JK-45',
          title: 'Harry Potter',
          author: 'J.K Rowling',
          stock: 1,
        },
        {
          id: 2,
          code: 'SHR-1',
          title: 'A Study in Scarlet',
          author: 'Arthur Conan Doyle',
          stock: 1,
        },
      ],
    },
  })
  async findAll(): Promise<BookModel[]> {
    return this.bookService.findAll();
  }
}
