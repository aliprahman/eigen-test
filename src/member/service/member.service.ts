import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { MemberModel } from '../model/member.model';
import { TransactionModel } from '../../transaction/model/transaction.model';

@Injectable()
export class MemberService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(MemberModel)
    private memberModel: typeof MemberModel,
  ) {}

  async findAll(): Promise<MemberModel[]> {
    return this.memberModel.findAll({
      attributes: [
        'id',
        'code',
        'name',
        [
          this.sequelize.fn(
            'sum',
            this.sequelize.col('transactions.total_book'),
          ),
          'total_borrowed_book',
        ],
      ],
      include: [
        {
          model: TransactionModel,
          attributes: [],
        },
      ],
      group: ['MemberModel.id'],
    });
  }

  async findByCode(code: string): Promise<MemberModel> {
    return this.memberModel.findOne({
      where: {
        code,
      },
    });
  }
}
