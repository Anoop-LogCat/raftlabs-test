import { ConflictException, Injectable } from '@nestjs/common';
import { CsvParser, ParsedData } from 'nest-csv-parser';
import * as fs from 'fs';
import { join } from 'path';
import { Books } from './schema/book.schema';
import { Magazines } from './schema/magazines.schema';
import { filter, sortBy } from 'lodash';
import { WorkDto } from './dto/work.dto';
import { workType } from './constants/work.constant';
import { Authors } from './schema/author.schema';

@Injectable()
export class AppService {
  constructor(private readonly csvParser: CsvParser) {}

  async getBooks(): Promise<ParsedData<Books[]>> {
    const readStream = fs.createReadStream(
      join(__dirname, '..', 'src/data/books.csv'),
    );
    return await this.csvParser.parse(readStream, Books);
  }

  async getMagazines(): Promise<ParsedData<Magazines[]>> {
    const readStream = fs.createReadStream(
      join(__dirname, '..', 'src/data/magazines.csv'),
    );
    return await this.csvParser.parse(readStream, Magazines);
  }

  async getBookByISBN(isbn: string): Promise<Books[]> {
    const readStream = fs.createReadStream(
      join(__dirname, '..', 'src/data/books.csv'),
    );
    const data: Books[] = (await this.csvParser.parse(readStream, Books)).list;
    return filter(data, function (o) {
      return o.isbn === isbn;
    });
  }

  async getMagazineByISBN(isbn: string): Promise<Magazines[]> {
    const readStream = fs.createReadStream(
      join(__dirname, '..', 'src/data/magazines.csv'),
    );
    const data: Magazines[] = (
      await this.csvParser.parse(readStream, Magazines)
    ).list;
    return filter(data, function (o) {
      return o.isbn === isbn;
    });
  }

  async getWorksByAuthor(authorEmail: string): Promise<any> {
    const bookStream = fs.createReadStream(
      join(__dirname, '..', 'src/data/books.csv'),
    );
    const magazineStream = fs.createReadStream(
      join(__dirname, '..', 'src/data/magazines.csv'),
    );
    const bookData: Books[] = (await this.csvParser.parse(bookStream, Books))
      .list;
    const magazineData: Magazines[] = (
      await this.csvParser.parse(magazineStream, Magazines)
    ).list;
    const authorBooks = filter(bookData, function (o) {
      return o.authors === authorEmail;
    });
    const authorMagazines = filter(magazineData, function (o) {
      return o.authors === authorEmail;
    });
    return {
      books: authorBooks,
      magazines: authorMagazines,
    };
  }

  async getSortedWorks(): Promise<any> {
    const bookStream = fs.createReadStream(
      join(__dirname, '..', 'src/data/books.csv'),
    );
    const magazineStream = fs.createReadStream(
      join(__dirname, '..', 'src/data/magazines.csv'),
    );
    const bookData: Books[] = (await this.csvParser.parse(bookStream, Books))
      .list;
    const magazineData: Magazines[] = (
      await this.csvParser.parse(magazineStream, Magazines)
    ).list;
    return sortBy(
      [...bookData, ...magazineData],
      [
        function (o) {
          return o.title;
        },
      ],
    );
  }

  async createWork(workDto: WorkDto) {
    const readStream = fs.createReadStream(
      join(__dirname, '..', 'src/data/authors.csv'),
    );
    const data: Authors[] = (await this.csvParser.parse(readStream, Authors))
      .list;
    const authorData = filter(data, function (o) {
      return o.email === workDto.authors;
    });
    if (authorData.length === 0) {
      throw new ConflictException(`Author Email doesn't exist`);
    }
    if (workDto.type === workType.BOOK) {
      const path = join(__dirname, '..', 'src/data/books.csv');
      this.writeData(
        path,
        `${workDto.title};${workDto.isbn};${workDto.authors};${workDto.description}`,
      );
      return {
        status: 200,
        message: 'Book inserted successfully',
      };
    } else if (workDto.type === workType.MAGAZINE) {
      const path = join(__dirname, '..', 'src/data/magazines.csv');
      this.writeData(
        path,
        `${workDto.title};${workDto.isbn};${workDto.authors};${workDto.publishedAt}`,
      );
      return {
        status: 200,
        message: 'Magazine inserted successfully',
      };
    }
  }

  private writeData(filePath: string, csvData: any) {
    fs.appendFileSync(filePath, csvData);
    fs.appendFileSync(filePath, '\r\n');
  }
}
