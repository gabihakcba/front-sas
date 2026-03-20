export interface SpreadsheetImportCreatedRow {
  rowNumber: number;
  nombre: string;
  id: number;
}

export interface SpreadsheetImportErrorRow {
  rowNumber: number;
  identifier: string;
  message: string;
}

export interface SpreadsheetImportResult {
  totalRows: number;
  createdCount: number;
  errorCount: number;
  created: SpreadsheetImportCreatedRow[];
  errors: SpreadsheetImportErrorRow[];
}
