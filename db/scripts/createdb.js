import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import sqlite from 'sqlite3';

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

class AppDAO {
  constructor(dbFilePath) {
    this.db = new sqlite.Database(dbFilePath, (err) => {
      if (err) {
        throw new Error('Could not connect to database', err);
      } else {
        console.log('Connected to database');
      }
    });
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, (err) => {
        if (err) {
          console.log('Error running sql ' + sql);
          console.log(err);
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      });
    });
  }
}

const args = process.argv.slice(2);
const dbPath = args.find((arg) => arg.startsWith('db=')).replace(/db=/, '');
const dataPath = args.find((arg) => arg.startsWith('dataDir=')).replace(/dataDir=/, '');
const dbAbsPath = path.resolve(dbPath);
const dataAbsPath = path.resolve(dataPath);
console.log(`Creating database at ${dbAbsPath}`);
const appDao = new AppDAO(dbAbsPath);

fs.readdir(dataAbsPath, (err, files) => {
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
      fs.createReadStream(`${dataAbsPath}/${first}`)
        .pipe(csv())
        .on('headers', (h) => {
          headers = h;
          resolve(headers);
        });
    } else {
      reject(new Error('No headers found'));
    }
  });

  // listing all files using forEach
  headerPromise
    .then((headers) => {
      appDao.run(`CREATE TABLE IF NOT EXISTS daily_reports_us (
        ${Object.keys(dataTypes)
          .map((k) => {
            return k === 'id'
              ? `${k.toLowerCase()} ${dataTypes[k]} PRIMARY KEY AUTOINCREMENT`
              : `${k.toLowerCase()} ${dataTypes[k]}`;
          })
          .join(',\n')}
      )`);

      // TODO: this should run after the CREATE TABLE promise resolves.
      files.forEach((file) => {
        const results = [];
        const [month, day, year] = file.replace(/\.csv/, '').split('-');
        const date = `${year}-${month}-${day}`;
        const quote = (str) => `'${str}'`;
        fs.createReadStream(`${dataAbsPath}/${file}`)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => {
            const values = results
              .map((current) => {
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
                      })
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
    })
    .catch((err) => {
      console.log('Some shit went wrong', err);
    });
});

export default AppDAO;
