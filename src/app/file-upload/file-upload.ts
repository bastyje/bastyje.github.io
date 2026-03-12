import { Component, output, signal } from '@angular/core';
import { Button } from '../button/button';

@Component({
  selector: 'app-file-upload',
  imports: [
    Button
  ],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.css',
})
export class FileUpload {
  id = `file-to-pseudonymize-${Math.random() * 1_000_000}`;

  readonly emptyFile = '___empty_file___';

  fileSelected = output<File>();
  file = signal<File>(<File>{name: this.emptyFile})

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.file.set(target.files![0]);
    this.fileSelected.emit(this.file());
  }
}
