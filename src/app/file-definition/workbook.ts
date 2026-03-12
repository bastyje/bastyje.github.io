import { validate } from './pesel-validation';
import * as XLSX from 'xlsx';

export type RowError = {
  canProceed: boolean
  rowNo: number;
  error: string;
}

export type WorkbookContent = {
  header: any | null;
  content: any[] | null;
  errors: RowError[];
  error: string | null;
  sheetName: string | null;
  canProceed: boolean;
}

export type HashAndRaw = {
  hash: string;
  raw: string;
}

export type HashRawAndRow = HashAndRaw & {
  row: any
}

export const getValidatedWorkbook = (buf: ArrayBuffer, sheetNo: number, colNo: number, isHeader: boolean) => {
  const wb = getWorkbook(buf, sheetNo, isHeader);
  if (wb.error) {
    return wb;
  }

  const colNoStr = XLSX.utils.encode_col(colNo - 1);
  const errors = validate(wb.content!, colNoStr);
  if (errors.some((x: any) => !x.canProceed)) {
    return <WorkbookContent>{ errors: errors, canProceed: false };
  }

  return {
    header: wb.header,
    content: wb.content,
    sheetName: wb.sheetName,
    errors: errors,
    error: null,
    canProceed: true,
  }
}

export const getWorkbook = (buf: ArrayBuffer, sheetNo: number, isHeader: boolean): WorkbookContent => {
  const wb = XLSX.read(buf);
  if (sheetNo > wb.SheetNames.length) {
    return <WorkbookContent>{ error: 'wrong sheet number', canProceed: false };
  }

  const sheetName = wb.SheetNames[sheetNo - 1];
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

  return isHeader
    ? { header: header, content: content, sheetName, error: null, errors: [], canProceed: true }
    : { header: {}, content: [header, ...content], sheetName, error: null, errors: [], canProceed: true };
}
