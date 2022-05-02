import {
  Column,
  Model,
  Table,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { MemberModel } from '../../member/model/member.model';

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
  loadDate: string;

  @Column
  total_book: number;

  @BelongsTo(() => MemberModel)
  member: MemberModel;
}
