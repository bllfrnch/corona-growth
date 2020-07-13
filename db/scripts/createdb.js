import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import csv from 'csv-parser';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { dailyReportsUS, tables } from '../../shared/db/constants';
import { buildCreateTableSql, buildInsertSql } from '../../shared/db/util';

const dataTypes = {
  id: 'INTEGER',
  date: 'TEXT',
  Province_State: 'TEXT',
  Country_Region: 'TEXT',
  Last_Update: 'TEXT',
  Lat: 'REAL',
  Long_: 'REAL',
  Confirmed: 'INTEGER',
  Deaths: 'INTEGER',
  Recovered: 'INTEGER',
  New_Cases: 'INTEGER',
  Active: 'INTEGER',
  FIPS: 'INTEGER',
  Incident_Rate: 'REAL',
  People_Tested: 'INTEGER',
  People_Hospitalized: 'INTEGER',
  Mortality_Rate: 'REAL',
  UID: 'INTEGER',
  ISO3: 'TEXT',
  Testing_Rate: 'REAL',
  Hospitalization_Rate: 'REAL',
};

let db = null;
let locationData = null;
const args = process.argv.slice(2);
// TODO: this is ugly, fix it
const dbPath = args.find((arg) => arg.startsWith('db=')).replace(/db=/, '');
const caseDataPath = args.find((arg) => arg.startsWith('dataDir=')).replace(/dataDir=/, '');
const locationDataPath = args.find((arg) => arg.startsWith('locationData=')).replace(/locationData=/, '');
const populationDataPath = args.find((arg) => arg.startsWith('populationData=')).replace(/populationData=/, '');
// TODO: this is ugly, fix it
const dbAbsPath = path.resolve(dbPath);
const caseDataAbsPath = path.resolve(caseDataPath);
const locationDataAbsPath = path.resolve(locationDataPath);
const populationDataAbsPath = path.resolve(populationDataPath);
// TODO: Could also be cleaned up
const readdirAsync = promisify(fs.readdir);
const readFileAsync = promisify(fs.readFile);
const connect = async () => {
  // open the database
  db = await open({
    filename: dbPath,
    driver: sqlite3.cached.Database,
  });
  console.log('INFO: Connected');
};

console.log(`INFO: Creating database at ${dbAbsPath}`);

connect()
  // Create the database tables
  .then(async () => {
    const [createLocalitiesTableSql, createReportsTableSql, createStatesTableSql] =
      [tables.localities, tables.reports, tables.states].map(def => buildCreateTableSql(def));
    // TODO: clean this up
    return db.getDatabaseInstance().serialize(() => {
      db.run(createLocalitiesTableSql);
      db.run(createReportsTableSql);
      db.run(createStatesTableSql);
    });
  })
  .then(() => console.log('INFO: Tables created'))
  // Populate the States table
  .then(async () => {
    console.log(`INFO: Reading location data from ${locationDataAbsPath}`);
    const locationStream = await fs.createReadStream(locationDataAbsPath, {encoding: 'utf8'});
    return new Promise((resolve, reject) => {
      const results = [];
      locationStream
        .pipe(
          csv([
            'id', 'iso2', 'iso3', 'code3', 'fips', 'admin2', 'province_state', 'country_region', 'lat', 'lon',
            'combined_key', 'population'
          ])
        )
        .on('data', (data) => results.push(data))
        .on('end', () => {
          locationData = results;
          resolve();
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  })
  .then(() => {
    const usaData = locationData.filter(row => row.iso3 === 'USA');
    const usaStates = usaData.filter(row => row.lat && row.lon && row.fips.length === 2);
    const insertStatesDataSql = buildInsertSql(
      tables.states,
      usaStates,
      { fips: 'fips', lat: 'lat', lon: 'lon', population: 'population', name: 'province_state' }
    );
    return db.run(insertStatesDataSql);
  })
  .then(() => console.log(`INFO: Inserted data into table States`))
  .then(() => {
    const usaData = locationData.filter(row => row.iso3 === 'USA');
    const usaLocalities = usaData.filter(row => row.lat && row.lon && row.fips.length === 5);
    const insertLocalitiesDataSql = buildInsertSql(
      tables.localities,
      usaLocalities,
      { fips: 'fips', lat: 'lat', lon: 'lon', population: 'population', name: 'admin2' }
    );
    return db.run(insertLocalitiesDataSql);
  })
  .then(() => console.log(`INFO: Inserted data into table Localities`))
  .then(async () => {
    const files = await readdirAsync(caseDataAbsPath);
    // console.log(files);
    return files;
  })
  // .then((data) => {
  //   console.log(data)
  // })
  .catch((err) => {
    console.error(`==== ERROR ====`);
    console.error(`${err}`);
    console.error(`===============`);
  });

fs.readdir(caseDataAbsPath, (err, files) => {
  // handling error
  if (err) {
    throw new Error(`Unable to scan directory: ${err}`);
  }

  if (!files.length) {
    throw new Error(`No files to read!`);
  }

  const headerPromise = new Promise((resolve, reject) => {
    let headers;
    // Get field names from first data file
    const first = files.find((file) => file.match(/^\d{2,}-\d{2,}-\d{4,}/));
    if (first) {
      fs.createReadStream(`${caseDataAbsPath}/${first}`)
        .pipe(
          csv([
          'id', 'iso2', 'iso3', 'code3', 'fips', 'admin2', 'province_state', 'country_region', 'lat', 'lon', 'population'
          ])
        )
        .on('headers', (h) => {
          headers = h;
          resolve(headers);
        });
    } else {
      reject(new Error('No headers found'));
    }
  });

  // get the headers
  headerPromise
    .then((headers) => {
      appDao
        // create the table
        .run(
          `CREATE TABLE IF NOT EXISTS daily_reports_us (
            ${Object.keys(dataTypes)
            .map((k) => {
              return k === 'id'
                ? `${k.toLowerCase()} ${dataTypes[k]} PRIMARY KEY AUTOINCREMENT`
                : `${k.toLowerCase()} ${dataTypes[k]}`;
            })
            .join(',\n')}
          )`,
        )
        // insert the data
        .then(() => {
          files.forEach((file) => {
            const results = [];
            const [month, day, year] = file.replace(/\.csv/, '').split('-');
            const date = `${year}-${month}-${day}`;
            const quote = (str) => `'${str}'`;
            fs.createReadStream(`${caseDataAbsPath}/${file}`)
              .pipe(csv())
              .on('data', (data) => results.push(data))
              .on('end', () => {
                const values = results
                  .map((current) => {
                    // Calculate new cases, new recoveries, new hospitalizations, new deaths since yesteray
                    const newCases = 0;
                    const newRecoveries = 0;
                    const newHospitalizations = 0;
                    const newDeaths = 0;
                    // Start by prepending an array for the columns we've added, a null
                    // value for the auto increment id field, and a date for the date field.
                    // Then we build up an array of data from the csv file, adding null values
                    // when empty strings are found, and use the dataTypes lookup table to
                    // decide whether to quote or not.
                    return `(
                      ${['null', quote(date)]
                      .concat(
                        headers.map((h) => {
                          if (current[h] === '') {
                            return 'null';
                          }
                          return dataTypes[h] === 'TEXT' ? quote(current[h]) : current[h];
                        }),
                      )
                      .join(', ')}
                    )`;
                  })
                  .join(',\n');

                const insertStatement = `
                  INSERT INTO daily_reports_us
                  VALUES 
                    ${values}
                  ;
                `;

                appDao.run(insertStatement);
              });
          });
        });
    })
    .catch((e) => {
      console.log('Some shit went wrong', e);
    });
});
