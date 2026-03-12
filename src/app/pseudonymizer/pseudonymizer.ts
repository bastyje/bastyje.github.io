import { Component, signal } from '@angular/core';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { from, map, mergeMap, Observable, toArray } from 'rxjs';
import { FileUpload } from '../file-upload/file-upload';
import { RowError } from '../file-definition/pesel-validation';
import { getValidatedWorkbook, HashAndRaw, HashRawAndRow } from '../file-definition/workbook';
import { Errors } from '../errors/errors';

@Component({
  selector: 'app-pseudonymizer',
  imports: [
    FormsModule,
    FileUpload,
    Errors
  ],
  templateUrl: './pseudonymizer.html',
  styleUrl: './pseudonymizer.css',
})
export class Pseudonymizer {
  error = signal<RowError[]>([]);
  sheetNo = signal(1);
  colNo = signal(1);

  onFileSelected(file: File): void {
    this.error.set([])
    file.arrayBuffer().then(b => this.openWorkbook(b, file.name));
  }

  private openWorkbook(buf: ArrayBuffer, name: string) {
    const wb = getValidatedWorkbook(buf, this.sheetNo(), this.colNo(), true);
    if (!wb.canProceed) {
      this.error.set(wb.errors);
      return;
    }

    this.hashAll(wb.content!).subscribe(x => {
      const [n, ext] = name.split('.');
      this.writePseudonymized(wb.header, wb.sheetName!, name, ext, x)
      this.writeMapping(n, ext, x)
    });
  }


  private hashAll(content: any[]): Observable<HashRawAndRow[]> {
    return from(content).pipe(
      mergeMap(row => this.hashRow(row, XLSX.utils.encode_col(this.colNo() - 1))),
      toArray()
    );
  }

  private hashRow(row: any, colNo: string): Observable<HashRawAndRow> {
    const col = row[colNo];
    let val = col.toString();

    if (val.length === 10) {
      val = `0${val}`;
    }

    const newRow = {...row};
    return this.hash(val).pipe(map(h => {
      newRow[colNo] = h.hash;
      return { ...h, row: newRow };
    }))
  }

  private hash = (input: string): Observable<HashAndRaw> =>
    fromPromise(window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(input))).pipe(
      map(buf => Array.from(new Uint8Array(buf))
          .map(item => item.toString(16).padStart(2, "0"))
          .join("")
      ),
      map(x => ({hash: x, raw: input}))
    );

  private writePseudonymized(header: any, sheetName: string, name: string, ext: string, x: HashRawAndRow[]): void {
    const newSheet = XLSX.utils.json_to_sheet([header, ...x.map(y => y.row)], {skipHeader: true});
    console.log(newSheet);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, newSheet, sheetName);
    XLSX.writeFile(workbook, `${name.replace('.xlsx', '')}__sanitized.${ext}`, {});
  }

  private writeMapping(name: string, ext: string, x: HashRawAndRow[]): void {
    const mapping = x.map(x => (<HashAndRaw>{raw: x.raw, hash: x.hash}))
    const mappingSheet = XLSX.utils.json_to_sheet(mapping);
    const mappingWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(mappingWorkbook, mappingSheet);
    XLSX.writeFile(mappingWorkbook, `${name.replace('.xlsx', '')}__mapping.${ext}`);
  }
}
