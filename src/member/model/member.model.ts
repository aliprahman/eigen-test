import { Column, Model, Table, HasMany } from 'sequelize-typescript';
import { TransactionModel } from '../../transaction/model/transaction.model';

@Table({
  tableName: 'members',
})
export class MemberModel extends Model {
  @Column
  code: string;

  @Column
  name: string;

  @HasMany(() => TransactionModel)
  transactions: TransactionModel[];
}
