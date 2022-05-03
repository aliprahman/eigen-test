import {
  Column,
  Model,
  Table,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { MemberModel } from '../../member/model/member.model';
import { TransactionModel } from './transaction.model';
@Table({
  tableName: 'penalties',
})
export class PenaltyModel extends Model {
  @ForeignKey(() => MemberModel)
  @Column
  member_id: string;

  @ForeignKey(() => TransactionModel)
  transaction_id: TransactionModel;

  @Column
  from_date: string;

  @Column
  to_date: string;

  @BelongsTo(() => MemberModel)
  member: MemberModel;

  @BelongsTo(() => TransactionModel)
  transaction: TransactionModel;
}
