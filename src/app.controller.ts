import { Controller, Get } from '@nestjs/common';
import { ParsedData } from 'nest-csv-parser';
import { AppService } from './app.service';
import { Books } from './schema/book.schema';
import { Magazines } from './schema/magazines.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('books/all')
  async getBooks(): Promise<ParsedData<Books[]>> {
    return await this.appService.getBooks();
  }

  @Get('magazines/all')
  async getMagazines(): Promise<ParsedData<Magazines[]>> {
    return await this.appService.getMagazines();
  }
}
