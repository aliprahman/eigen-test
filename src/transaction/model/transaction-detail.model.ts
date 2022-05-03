import {
  Column,
  Model,
  Table,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { BookModel } from '../../book/model/book.model';
import { TransactionModel } from './transaction.model';
@Table({
  tableName: 'transaction_details',
})
export class TransactionDetailModel extends Model {
  @ForeignKey(() => BookModel)
  @Column
  book_id: string;

  @ForeignKey(() => TransactionModel)
  transaction_id: TransactionModel;

  @Column
  return_date: string;

  @Column
  status: string;

  @BelongsTo(() => BookModel)
  book: BookModel;

  @BelongsTo(() => TransactionModel)
  transaction: TransactionModel;
}
