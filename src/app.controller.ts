import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ParsedData } from 'nest-csv-parser';
import { AppService } from './app.service';
import { WorkDto } from './dto/work.dto';
import { Books } from './schema/book.schema';
import { Magazines } from './schema/magazines.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('books')
  async getBooks(): Promise<ParsedData<Books[]>> {
    return await this.appService.getBooks();
  }

  @Get('magazines')
  async getMagazines(): Promise<ParsedData<Magazines[]>> {
    return await this.appService.getMagazines();
  }

  @Get('books/:isbn')
  async getBookByISBN(@Param('isbn') isbn: string): Promise<Books[]> {
    return await this.appService.getBookByISBN(isbn);
  }

  @Get('magazines/:isbn')
  async getMagazineByISBN(@Param('isbn') isbn: string): Promise<Magazines[]> {
    return await this.appService.getMagazineByISBN(isbn);
  }

  @Get('author/works')
  async getWorksByAuthor(@Query('email') authorEmail: string): Promise<any> {
    return await this.appService.getWorksByAuthor(authorEmail);
  }

  @Get('works/all')
  async getSortedWorks(): Promise<any> {
    return await this.appService.getSortedWorks();
  }

  @Post('works/create')
  async createWork(@Body(new ValidationPipe()) workDto: WorkDto) {
    return await this.appService.createWork(workDto);
  }
}
