import { Component, signal } from '@angular/core';
import { FileUpload } from '../file-upload/file-upload';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { RowError } from '../file-definition/pesel-validation';
import { getValidatedWorkbook, getWorkbook, WorkbookContent } from '../file-definition/workbook';
import { Errors } from '../errors/errors';

@Component({
  selector: 'app-de-pseudonymizer',
  imports: [
    FileUpload,
    ReactiveFormsModule,
    FormsModule,
    Errors
  ],
  templateUrl: './de-pseudonymizer.html',
  styleUrl: './de-pseudonymizer.css',
})
export class DePseudonymizer {

  error = signal<RowError[]>([]);
  hashSheetNo = signal(1);
  hashColNo = signal(1);
  peselColNo = signal(2);
  clinicalSheetNo = signal(1);
  clinicalColNo = signal(1);
  notAll = signal(false);

  map: Map<string, string> = new Map();

  hashProcessed: boolean = false;
  clinicalProcessed: boolean = false;

  clinicalWb: WorkbookContent | null = null;
  clinicalName: string | null = null;

  onMappingFileSelected(file: File): void {
    this.error.set([])
    file.arrayBuffer().then(b => {
      const wb = getValidatedWorkbook(b, this.hashSheetNo(), this.peselColNo(), true);
      if (!wb.canProceed) {
        this.error.set(wb.errors);
        return;
      }

      const peselColNo = XLSX.utils.encode_col(this.peselColNo() - 1);
      const hashColNo = XLSX.utils.encode_col(this.hashColNo() - 1);

      for (const row of wb.content!) {
        this.map.set(row[hashColNo], row[peselColNo]);
      }

      this.hashProcessed = true;
      this.trySave();
    });
  }

  onClinicalFileSelected(file: File): void {
    file.arrayBuffer().then(b => {
      this.clinicalWb = getWorkbook(b, this.clinicalSheetNo(), true);
      this.clinicalName = file.name;
      this.clinicalProcessed = true;
      this.trySave();
    });
  }

  private canSave = () => this.hashProcessed && this.clinicalProcessed;

  private trySave = () => {
    if (!this.canSave()) {
      return;
    }

    const clinicalColNo = XLSX.utils.encode_col(this.clinicalColNo() - 1);
    for (const row of this.clinicalWb!.content!) {
      const pesel = this.map.get(row[clinicalColNo]);
      if (!pesel) {
        this.notAll.set(true);
        continue;
      }
      row[clinicalColNo] = pesel;
    }

    const newSheet = XLSX.utils.json_to_sheet([this.clinicalWb!.header!, ...this.clinicalWb!.content!], {skipHeader: true});
    console.log(newSheet);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, newSheet, this.clinicalWb!.sheetName!);
    XLSX.writeFile(workbook, `${this.clinicalName?.replace('.xlsx', '')}__pesel.xlsx`, {});
  }
}
