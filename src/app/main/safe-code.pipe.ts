import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
  name: 'safeCode'
})
export class SafeCodePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(value: any, ...args: any[]): any {
    return value;
  }

}
