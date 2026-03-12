export type RowError = {
  canProceed: boolean
  rowNo: number;
  error: string;
}

export const validate = (content: any[], colNo: string): RowError[] => {
  const errors: RowError[] = [];

  for (let i = 0; i < content.length; i++) {
    const col = content[i][colNo];
    let val = col.toString();
    if (val.length === 10) {
      errors.push({
        canProceed: true,
        rowNo: i + 1,
        error: `PESEL “${val}” is one digit too short. A leading “0” has been automatically added, as Excel sometimes removes it. If this is incorrect, please verify and correct your input.`
      })
    } else if (val.length < 10) {
      errors.push({
        canProceed: false,
        rowNo: i + 1,
        error: `PESEL '${val}' is too short (${val.length} characters)`
      })
    } else if (val.length > 11) {
      errors.push({
        canProceed: false,
        rowNo: i + 1,
        error: `PESEL '${val}' is too long (${val.length} characters)`
      })
    }
  }

  return errors;
}
