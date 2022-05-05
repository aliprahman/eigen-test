import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayMaxSize,
  ArrayNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class BorrowBookRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  member_code: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(2)
  @ArrayNotEmpty()
  book_code: string[];
}
