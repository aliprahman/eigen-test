import {
  Controller,
  Post,
  Body,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BookService } from '../../book/service/book.service';
import { MemberService } from '../../member/service/member.service';
import { TransactionService } from '../service/transaction.service';
import { BorrowBookRequest } from '../request/borrow.request';
import { ReturnBookRequest } from '../request/return.request';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(
    private bookService: BookService,
    private memberService: MemberService,
    private transactionService: TransactionService,
  ) {}

  @ApiOkResponse({
    schema: {
      example: {
        message: 'success borrow book',
        data: {
          id: 5,
          code: 'L9YRW4',
          member_id: 1,
          loan_date: '2022-05-05',
          total_book: 1,
          transaction_details: [
            {
              id: 6,
              book_id: 4,
              return_date: null,
              status: 'BORROWED',
              transaction_id: 5,
              book: {
                id: 4,
                code: 'HOB-83',
                title: 'The Hobbit, or There and Back Again',
                author: 'J.R.R. Tolkien',
                stock: 0,
              },
            },
          ],
          member: {
            id: 1,
            code: 'M001',
            name: 'Angga',
          },
        },
      },
    },
  })
  @Post('/borrow')
  async borrowBook(@Body() body: BorrowBookRequest) {
    // check detail member
    const member = await this.memberService.findByCode(body.member_code);
    if (!member) {
      throw new NotFoundException('data member not found');
    }
    // check detail every book and status
    const books = [];
    for (let index = 0; index < body.book_code.length; index++) {
      const book_code = body.book_code[index];
      const book = await this.bookService.findByCode(book_code);
      if (!book) {
        throw new NotFoundException('data book not found');
      }
      const isBorrowed = await this.transactionService.checkBookStatus(book.id);
      if (isBorrowed >= book.stock) {
        throw new BadRequestException('book is being borrowed by other member');
      }
      books.push(book.id);
    }
    // check remaining quota borrow book
    const quota = await this.transactionService.checkRemainingQuota(member.id);
    if (quota >= 2 || books.length > quota) {
      throw new BadRequestException('member has reached the borrowing limit');
    }
    // check member penalty
    const penalty = await this.transactionService.checkMemberPenalty(member.id);
    if (penalty) {
      throw new BadRequestException('member are being penalized');
    }
    // borrow book
    const trx = await this.transactionService.borrowBook(member.id, books);
    const detailTrx = await this.transactionService.detailTransaction(trx.id);
    return {
      message: 'success borrow book',
      data: detailTrx,
    };
  }

  @ApiOkResponse({
    schema: {
      example: {
        message: 'success borrow book',
        data: {
          id: 5,
          code: 'L9YRW4',
          member_id: 1,
          loan_date: '2022-05-05',
          total_book: 1,
          transaction_details: [
            {
              id: 6,
              book_id: 4,
              return_date: '2022-05-10',
              status: 'RETURNED',
              transaction_id: 5,
              book: {
                id: 4,
                code: 'HOB-83',
                title: 'The Hobbit, or There and Back Again',
                author: 'J.R.R. Tolkien',
                stock: 1,
              },
            },
          ],
          member: {
            id: 1,
            code: 'M001',
            name: 'Angga',
          },
        },
      },
    },
  })
  @Post('/return')
  async returnBook(@Body() body: ReturnBookRequest) {
    // check detail member
    const member = await this.memberService.findByCode(body.member_code);
    if (!member) {
      throw new NotFoundException('data member not found');
    }
    // check detail book
    const book = await this.bookService.findByCode(body.book_code);
    if (!book) {
      throw new NotFoundException('data book not found');
    }
    // check is book borrowed by that member
    const isBorrowed = await this.transactionService.checkLoan(
      member.id,
      book.id,
    );
    if (!isBorrowed) {
      throw new BadRequestException(
        'book is not being borrowed by that member',
      );
    }
    // return book
    const trx = await this.transactionService.returnBook(member.id, book.id);
    const detailTrx = await this.transactionService.detailTransaction(trx.id);
    return {
      message: 'success return book',
      data: detailTrx,
    };
  }
}
