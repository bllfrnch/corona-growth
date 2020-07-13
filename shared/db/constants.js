// TODO: Need to turn this into an environment variable
export const dbPath = '/Users/208317/repos/corona-growth/db/corona.db';
export const dailyReportsUS = 'daily_reports_us';
export const tables = {
  reports: {
    name: 'Reports',
    columns: {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: 'INTEGER'
      },
      fips: 'TEXT',
      date: 'TEXT',
      cases: 'INTEGER',
      deaths: 'INTEGER',
      recoveries: 'INTEGER',
    },
  },
  localities: {
    name: 'Localities',
    columns: {
      fips: {
        primaryKey: true,
        type: 'TEXT'
      },
      name: 'TEXT',
      lat: 'REAL',
      lon: 'REAL',
      population: 'INTEGER',
    },
  },
  states: {
    name: 'States',
    columns: {
      fips: {
        primaryKey: true,
        type: 'TEXT'
      },
      name: 'TEXT',
      lat: 'REAL',
      lon: 'REAL',
      population: 'INTEGER',
    },
  }
};

export const columnMap = {
  Long_: 'lon',
};


export const columns = [
  'id',
  'province_state',
  'country_region',
  'last_update',
  'lat',
  'long_',
  'confirmed',
  'deaths',
  'recovered',
  'active',
  'fips',
  'incident_rate',
  'people_tested',
  'people_hospitalized',
  'mortality_rate',
  'uid',
  'iso3',
  'testing_rate',
  'hospitalization_rate',
  'date',
];
