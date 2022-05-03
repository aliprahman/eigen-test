import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BookModule } from '../book/book.module';
import { MemberModule } from '../member/member.module';
import { TransactionController } from './controller/transaction.controller';
import { TransactionService } from './service/transaction.service';
import { TransactionModel } from './model/transaction.model';
import { TransactionDetailModel } from './model/transaction-detail.model';
import { PenaltyModel } from './model/penalty.model';
@Module({
  imports: [
    SequelizeModule.forFeature([
      TransactionModel,
      TransactionDetailModel,
      PenaltyModel,
    ]),
    BookModule,
    MemberModule,
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [SequelizeModule, TransactionService],
})
export class TransactionModule {}
