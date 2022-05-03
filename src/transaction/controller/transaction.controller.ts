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

@Controller('transaction')
export class TransactionController {
  constructor(
    private bookService: BookService,
    private memberService: MemberService,
    private transactionService: TransactionService,
  ) {}

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
      if (isBorrowed) {
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
}
