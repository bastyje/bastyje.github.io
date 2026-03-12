import { Component, input } from '@angular/core';
import { RowError } from '../file-definition/workbook';

@Component({
  selector: 'app-errors',
  imports: [],
  templateUrl: './errors.html',
  styleUrl: './errors.css',
})
export class Errors {
  error = input<RowError[]>([]);
}
