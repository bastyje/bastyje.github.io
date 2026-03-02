import { Component, signal } from '@angular/core';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { from, map, mergeMap, Observable, of, toArray } from 'rxjs';

type HashAndRaw = {
  hash: string;
  raw: string;
}

type HashRawAndRow = HashAndRaw & {
  row: any
}

@Component({
  selector: 'app-pseudonymizer',
  imports: [
    FormsModule
  ],
  templateUrl: './pseudonymizer.html',
  styleUrl: './pseudonymizer.css',
})
export class Pseudonymizer {
  readonly emptyFile = '___empty_file___';

  error = signal<string[]>([]);
  sheetNo = signal(1);
  colNo = signal(1);
  file = signal<File>(<File>{name: this.emptyFile})

  onFileSelected(event: Event): void {
    this.error.set([]);

    const target = event.target as HTMLInputElement;
    const file = target.files![0];
    this.file.set(file);
    this.file().arrayBuffer().then(b => this.openWorkbook(b, this.file().name));
  }

  private openWorkbook(buf: ArrayBuffer, name: string) {
    const wb = XLSX.read(buf);
    if (this.sheetNo() > wb.SheetNames.length) {
      console.error('wrong no')
      return;
    }

    const sheetName = wb.SheetNames[this.sheetNo() - 1];
    const sheet = wb.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet, {
      blankrows: false,
      header: 'A'
    });

    const maxCols = json.reduce((prev: number, curr: any) => Math.max(prev, Object.keys(curr).length), 0)
    const threshold = Math.ceil(maxCols * 0.1);
    const filtered = json.filter((x: any) => Object.keys(x).length >= threshold) as any[];

    const header = filtered[0];
    const content = filtered.slice(1);

    console.log(content);

    this.hashAll(content).subscribe(x => {
      const newSheet = XLSX.utils.json_to_sheet([header, ...x.map(y => y.row)], {skipHeader: true});
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, newSheet, sheetName);
      const [n, ext] = name.split('.');
      XLSX.writeFile(workbook, `${n}__sanitized.${ext}`, {});

      const mapping = x.map(x => (<HashAndRaw>{raw: x.raw, hash: x.hash}))
      const mappingSheet = XLSX.utils.json_to_sheet(mapping);
      const mappingWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(mappingWorkbook, mappingSheet);
      XLSX.writeFile(mappingWorkbook, `${n}__mapping.${ext}`);
    });
  }

  private hashAll(content: any[]): Observable<HashRawAndRow[]> {
    const colNo = this.colNo() - 1;
    console.log(XLSX.utils.encode_col(colNo))
    return from(content).pipe(
      mergeMap(row => this.hashRow(row, colNo)),
      toArray()
    );
  }

  private hashRow(row: any, colNo: number): Observable<HashRawAndRow> {
    const col = row[XLSX.utils.encode_col(colNo)];
    let val = col.toString();

    if (val.length === 10) {
      this.error.update(x => [...x, `PESEL “${val}” is one digit too short. A leading “0” has been automatically added, as Excel sometimes removes it. If this is incorrect, please verify and correct your input.`])
      val = `0${val}`;
    } else if (val.length < 10) {
      this.error.update(x => [...x, `PESEL '${val}' is too short (${val.length} characters)`])
    } else if (val.length > 11) {
      this.error.update(x => [...x, `PESEL '${val}' is too long (${val.length} characters)`])
      return of()
    }

    const newRow = {...row};
    return this.hash(val).pipe(map(h => {
      newRow[XLSX.utils.encode_col(colNo)] = h;
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
}
