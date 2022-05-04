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

  async checkBookStatus(book_id: number): Promise<number> {
    return this.transactionDetailModel.count({
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

  async checkLoan(member_id: number, book_id: number): Promise<boolean> {
    const data = await this.transactionModel.count({
      where: {
        member_id,
      },
      include: [
        {
          model: TransactionDetailModel,
          required: true,
          where: {
            book_id,
          },
        },
      ],
    });

    return data > 0 ? true : false;
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

  async returnBook(
    member_id: number,
    book_id: number,
  ): Promise<TransactionModel> {
    try {
      return this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };
        const loan = await this.transactionModel.findOne({
          where: {
            member_id,
          },
          include: [
            {
              model: TransactionDetailModel,
              required: true,
              where: {
                book_id,
              },
            },
          ],
        });

        // update transaction details
        await this.transactionDetailModel.update(
          {
            return_date: moment().format('YYYY-MM-DD'),
            status: 'RETURNED',
          },
          {
            where: {
              transaction_id: loan.id,
              book_id,
            },
            ...transactionHost,
          },
        );

        // increment stock
        await this.bookModel.increment('stock', {
          by: 1,
          where: { id: book_id },
          ...transactionHost,
        });

        // check penalty
        const maxReturnDate = moment(loan.loan_date).add(7, 'day');
        if (moment().isAfter(maxReturnDate)) {
          let penalty = await this.penaltyModel.findOne({
            where: {
              transaction_id: loan.id,
            },
          });
          if (penalty) {
            penalty.from_date = moment().format('YYYY-MM-DD');
            penalty.to_date = moment().add(3, 'day').format('YYYY-mm-DD');
            await penalty.save({
              ...transactionHost,
            });
          } else {
            penalty = await this.penaltyModel.create(
              {
                transaction_id: loan.id,
                member_id: loan.member_id,
                from_date: moment().format('YYYY-MM-DD'),
                to_date: moment().add(3, 'day').format('YYYY-mm-DD'),
              },
              transactionHost,
            );
          }
        }

        return loan.reload();
      });
    } catch (err) {
      // Transaction has been rolled back
      console.log(err);
      throw new InternalServerErrorException('failed to borrow book');
    }
  }
}
