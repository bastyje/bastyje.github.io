import { Component, signal } from '@angular/core';
import { Button } from '../button/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { optional } from '../file-definition/columns';
import { createFile } from '../file-definition/create-file';

@Component({
  selector: 'app-get-file',
  imports: [
    Button,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './get-file.html',
  styleUrl: './get-file.css',
})
export class GetFile {
  yearsNo = signal(5);
  optional = optional.map(x => ({...x, selected: false}))

  onClick(): void {
    createFile(this.optional.filter(x => x.selected), this.yearsNo());
  }
}
