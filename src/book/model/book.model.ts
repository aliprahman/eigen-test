import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'books',
})
export class BookModel extends Model {
  @Column
  code: string;

  @Column
  title: string;

  @Column
  author: string;

  @Column
  stock: number;
}
