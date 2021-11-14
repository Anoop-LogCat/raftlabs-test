import { Injectable } from '@nestjs/common';
import { CsvParser, ParsedData } from 'nest-csv-parser';
import * as fs from 'fs';
import { join } from 'path';
import { Books } from './schema/book.schema';
import { Magazines } from './schema/magazines.schema';

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
}
