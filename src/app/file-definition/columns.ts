import { Column, ColumnType } from './column';

export const required: Column[] = [
  {
    name: 'pesel',
    type: ColumnType.Pesel,
    iterative: false,
  },
  {
    name: 'gender',
    type: ColumnType.Gender,
    iterative: false,
  },
  {
    name: 'birth_date',
    type: ColumnType.Date,
    iterative: false,
  },
  {
    name: 'diagnosis_date',
    type: ColumnType.Date,
    iterative: false,
  },
  {
    name: 'first_treatment_date',
    type: ColumnType.Date,
    iterative: false,
  },
  {
    name: 'number_of_therapies',
    type: ColumnType.Integer,
    iterative: false,
  },
  {
    name: 'previous_drugs',
    type: ColumnType.ListOfStrings,
    iterative: false,
  },
  {
    name: 'cause_of_drug_change',
    type: ColumnType.ListOfStrings,
    iterative: false,
  },
  {
    name: 'previous_drug_last_dose_date',
    type: ColumnType.Date,
    iterative: false,
  },
  {
    name: 'first_dose_date',
    type: ColumnType.Date,
    iterative: false,
  },
  {
    name: 'adverse_effects_associated_with_therapy',
    type: ColumnType.ListOfStrings,
    iterative: false,
  },
  {
    name: 'treatment_terminated',
    type: ColumnType.Boolean,
    iterative: false,
  },
  {
    name: 'termination_reason',
    type: ColumnType.ListOfStrings,
    iterative: false,
  },
  {
    name: 'notes',
    type: ColumnType.String,
    iterative: false,
  },
  {
    name: '0_relapses',
    type: ColumnType.Integer,
    iterative: false,
  },
  {
    name: '0_edss',
    type: ColumnType.Edss,
    iterative: false,
  },
  {
    name: '{year}_relapses',
    type: ColumnType.Integer,
    iterative: true,
  },
  {
    name: '{year}_lesions_t2',
    type: ColumnType.Integer,
    iterative: true,
  },
  {
    name: '{year}_lesions_gd_plus',
    type: ColumnType.Integer,
    iterative: true,
  },
  {
    name: '{year}_relapse_dates',
    type: ColumnType.ListOfDates,
    iterative: true,
  },
  {
    name: '{year}_edss',
    type: ColumnType.Edss,
    iterative: true,
  },
];

export const optional: Column[] = [
  {
    name: '{year}_lymphocyte_count_before',
    type: ColumnType.Float,
    iterative: true,
  },
  {
    name: '{year}_lymphocyte_count',
    type: ColumnType.Float,
    iterative: true,
  },
  {
    name: '{year}_lymphocyte_count_6_months',
    type: ColumnType.Float,
    iterative: true,
  },
  {
    name: 'covid_vaccine (bool)',
    type: ColumnType.Boolean,
    iterative: false,
  },
  {
    name: 'had_covid (bool)',
    type: ColumnType.Boolean,
    iterative: false,
  },
  {
    name: 'chronic_diseases',
    type: ColumnType.ListOfStrings,
    iterative: false,
  },
];
