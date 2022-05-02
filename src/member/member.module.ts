import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MemberModel } from './model/member.model';
import { MemberController } from './controller/member.controller';
import { MemberService } from './service/member.service';

@Module({
  imports: [SequelizeModule.forFeature([MemberModel])],
  providers: [MemberService],
  controllers: [MemberController],
  exports: [SequelizeModule],
})
export class MemberModule {}
