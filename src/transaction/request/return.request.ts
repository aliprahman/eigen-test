import { IsNotEmpty, IsString } from 'class-validator';

export class ReturnBookRequest {
  @IsNotEmpty()
  @IsString()
  member_code: string;

  @IsNotEmpty()
  @IsString()
  book_code: string;
}
