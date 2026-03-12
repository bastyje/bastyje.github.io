export enum ColumnType {
  Date = 1,
  Boolean = 2,
  Integer = 3,
  Float = 4,
  String = 5,
  ListOfStrings = 6,
  ListOfDates = 7,
  Gender = 8,
  Pesel = 9,
  Edss = 10,
}

export type Column = {
  name: string;
  type: ColumnType;
  iterative: boolean;
}
