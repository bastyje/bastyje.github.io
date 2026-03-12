import { Column } from './column';
import * as XLSX from 'xlsx';
import { required } from './columns';

export const createFile = (columns: Column[], years: number): void => {
  const allColumnsRaw = [...required, ...columns];

  const allColumns: string[] = [];
  for (const column of allColumnsRaw) {
    if (!column.iterative) {
      allColumns.push(column.name)
      continue;
    }

    for (let i = 0; i <= years; i++) {
      allColumns.push(column.name.replace('{year}', i.toString()));
    }
  }

  const headerJson: any = {};
  for (let i = 0; i < allColumns.length; i++) {
    const colNo = XLSX.utils.encode_col(i);
    headerJson[colNo] = allColumns[i];
  }

  const sheet = XLSX.utils.json_to_sheet([headerJson], {skipHeader: true});
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, 'data');
  XLSX.writeFile(workbook, 'new_file.xlsx');
}
