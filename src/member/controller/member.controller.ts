import { Controller, Get } from '@nestjs/common';
import { MemberService } from '../service/member.service';
import { MemberModel } from '../model/member.model';

@Controller('member')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Get()
  async findAll(): Promise<MemberModel[]> {
    return this.memberService.findAll();
  }
}
