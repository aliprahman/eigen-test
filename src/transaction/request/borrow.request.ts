import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayMaxSize,
  ArrayNotEmpty,
} from 'class-validator';

export class BorrowBookRequest {
  @IsNotEmpty()
  @IsString()
  member_code: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(2)
  @ArrayNotEmpty()
  book_code: string[];
}
