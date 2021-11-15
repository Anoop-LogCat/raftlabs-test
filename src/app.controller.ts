import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Render,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import * as Handlebars from 'handlebars';
import { ParsedData } from 'nest-csv-parser';
import { join } from 'path';
import { AppService } from './app.service';
import { WorkDto } from './dto/work.dto';
import { Authors } from './schema/author.schema';
import { Books } from './schema/book.schema';
import { Magazines } from './schema/magazines.schema';
import { partialConversion } from './utils/partial-converison.util';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    const path = join(__dirname, '..', 'views');
    Handlebars.registerPartial('header', partialConversion(path, 'header.hbs'));
    Handlebars.registerPartial(
      'books',
      partialConversion(path, 'partials/books.hbs'),
    );
    Handlebars.registerPartial(
      'magazines',
      partialConversion(path, 'partials/magazines.hbs'),
    );
    Handlebars.registerPartial(
      'authors',
      partialConversion(path, 'partials/authors.hbs'),
    );
    Handlebars.registerPartial(
      'authorWorks',
      partialConversion(path, 'partials/works.hbs'),
    );
    Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
      return arg1 == arg2 ? options.fn(this) : options.inverse(this);
    });
  }

  @Get('/')
  @Render('index.hbs')
  async indexPage(@Res() res) {
    return res.status(302).redirect('/pages/home/Books');
  }

  @Get('pages/home/:pageId')
  @Render('home.hbs')
  async homePage(@Param('pageId') pageId: string, @Res() res, @Query() query) {
    if (pageId === 'Books') {
      const books =
        query.search === undefined
          ? (await this.appService.getBooks()).list
          : await this.appService.getBookByISBN(query.search);
      return {
        pageId,
        title: 'Home | Books',
        payload: books,
      };
    } else if (pageId === 'Magazines') {
      const magazines =
        query.search === undefined
          ? (await this.appService.getMagazines()).list
          : await this.appService.getMagazineByISBN(query.search);
      return {
        pageId,
        title: 'Home | Magazines',
        payload: magazines,
      };
    } else if (pageId === 'Authors') {
      const response =
        query.email === undefined
          ? (await this.appService.getAuthors()).list
          : await this.appService.getWorksByAuthor(query.email);
      return {
        pageId: query.email === undefined ? 'Authors' : 'Works',
        title: 'Home | Authors',
        payload: response,
      };
    } else {
      return res.status(302).redirect('/pages/error');
    }
  }

  @Get('pages/error')
  @Render('404.hbs')
  async errorPage() {
    return;
  }

  @Get('books')
  async getBooks(): Promise<ParsedData<Books[]>> {
    return await this.appService.getBooks();
  }

  @Get('magazines')
  async getMagazines(): Promise<ParsedData<Magazines[]>> {
    return await this.appService.getMagazines();
  }

  @Get('authors')
  async getAuthors(): Promise<ParsedData<Authors[]>> {
    return await this.appService.getAuthors();
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
