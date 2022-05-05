import { Controller, Get } from '@nestjs/common';
import { MemberService } from '../service/member.service';
import { MemberModel } from '../model/member.model';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('Member')
@Controller('member')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Get()
  @ApiOkResponse({
    description: 'success get list member',
    schema: {
      example: [
        {
          id: 1,
          code: 'M001',
          name: 'Angga',
          total_borrowed_book: 0,
        },
        {
          id: 2,
          code: 'M002',
          name: 'Ferry',
          total_borrowed_book: 1,
        },
      ],
    },
  })
  async findAll(): Promise<MemberModel[]> {
    return this.memberService.findAll();
  }
}
