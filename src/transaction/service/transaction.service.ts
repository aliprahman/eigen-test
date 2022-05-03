import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { TransactionModel } from '../model/transaction.model';
import { TransactionDetailModel } from '../model/transaction-detail.model';
import { PenaltyModel } from '../model/penalty.model';
import { BookModel } from '../../book/model/book.model';
import { MemberModel } from '../../member/model/member.model';
import { Op } from 'sequelize';
import * as moment from 'moment';
import * as randomstring from 'randomstring';

@Injectable()
export class TransactionService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(TransactionModel)
    private transactionModel: typeof TransactionModel,
    @InjectModel(TransactionDetailModel)
    private transactionDetailModel: typeof TransactionDetailModel,
    @InjectModel(PenaltyModel)
    private penaltyModel: typeof PenaltyModel,
    @InjectModel(BookModel)
    private bookModel: typeof BookModel,
  ) {}

  async checkMemberPenalty(member_id: number): Promise<PenaltyModel> {
    return this.penaltyModel.findOne({
      where: {
        member_id,
        to_date: {
          [Op.gte]: moment().format('YYYY-MM-DD'),
        },
      },
    });
  }

  async checkBookStatus(book_id: number): Promise<TransactionDetailModel> {
    return this.transactionDetailModel.findOne({
      where: {
        book_id,
        return_date: null,
        status: 'BORROWED',
      },
    });
  }

  async checkRemainingQuota(member_id: number): Promise<number> {
    return this.transactionDetailModel.count({
      where: {
        status: 'BORROWED',
        return_date: null,
      },
      include: [
        {
          model: TransactionModel,
          required: true,
          where: {
            member_id,
          },
        },
      ],
    });
  }

  async borrowBook(
    member_id: number,
    book_id: number[],
  ): Promise<TransactionModel> {
    try {
      return this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };

        const trx = await this.transactionModel.create(
          {
            member_id,
            code: randomstring.generate({
              length: 6,
              readable: true,
              charset: 'alphanumeric',
              capitalization: 'uppercase',
            }),
            loan_date: moment().format('YYYY-MM-DD'),
            total_book: book_id.length,
          },
          transactionHost,
        );
        for (let index = 0; index < book_id.length; index++) {
          const book = book_id[index];
          await this.transactionDetailModel.create(
            {
              transaction_id: trx.id,
              book_id: book,
              status: 'BORROWED',
            },
            transactionHost,
          );
          await this.bookModel.decrement('stock', {
            by: 1,
            where: { id: book },
            ...transactionHost,
          });
        }

        return trx;
      });
    } catch (err) {
      // Transaction has been rolled back
      console.log(err);
      throw new InternalServerErrorException('failed to borrow book');
    }
  }

  async detailTransaction(transaction_id: number): Promise<TransactionModel> {
    return this.transactionModel.findByPk(transaction_id, {
      include: [
        {
          model: TransactionDetailModel,
          required: true,
          include: [
            {
              model: BookModel,
              required: true,
            },
          ],
        },
        {
          model: MemberModel,
          required: true,
        },
      ],
    });
  }
}
