import { IsString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { workType } from 'src/constants/work.constant';

export class WorkDto {
  @IsEnum(['book', 'magazine'])
  type: workType;

  @IsString()
  @IsNotEmpty()
  title: number;

  @IsString()
  @IsNotEmpty()
  isbn: string;

  @IsString()
  @IsNotEmpty()
  authors: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  publishedAt: string;
}
