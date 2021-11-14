import { readFileSync } from 'file-system';
import { join } from 'path';
import * as Handlebars from 'handlebars';

export function partialConversion(path: string, partialFileName: string) {
  const partialFile = join(path, `${partialFileName}`);
  return Handlebars.compile(readFileSync(partialFile, 'utf-8'));
}
