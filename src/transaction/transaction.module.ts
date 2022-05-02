import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionModel } from './model/transaction.model';

@Module({
  imports: [SequelizeModule.forFeature([TransactionModel])],
  providers: [],
  controllers: [],
  exports: [SequelizeModule],
})
export class TransactionModule {}
