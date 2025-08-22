import { trimRecursive } from '../util/general.util';
import { PipeTransform } from '@nestjs/common';

export class TrimWhitespacePipe implements PipeTransform {
  transform(value: any) {
    return trimRecursive(value);
  }
}
