// TODO: Need to turn this into an environment variable
export const dbPath = '/Users/208317/repos/corona-growth/db/corona.db';
export const dailyReportsUS = 'daily_reports_us';
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
export const columnMap = {
  long_: 'lon',
};
