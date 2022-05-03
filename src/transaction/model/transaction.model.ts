import {
  Column,
  Model,
  Table,
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { MemberModel } from '../../member/model/member.model';
import { TransactionDetailModel } from './transaction-detail.model';

@Table({
  tableName: 'transactions',
})
export class TransactionModel extends Model {
  @Column
  code: string;

  @ForeignKey(() => MemberModel)
  @Column
  member_id: string;

  @Column
  loan_date: string;

  @Column
  total_book: number;

  @BelongsTo(() => MemberModel)
  member: MemberModel;

  @HasMany(() => TransactionDetailModel)
  transaction_details: TransactionDetailModel[];
}
