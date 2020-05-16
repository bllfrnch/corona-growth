import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import sqlite from 'sqlite3';

const table = [];

const dataTypes = {
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
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date DATE,
        ${Object.keys(dataTypes)
          .map((k) => {
            return `${k.toLowerCase()} ${dataTypes[k]}`;
          })
          .join(',\n')}
      )`);

      files.forEach((file) => {
        const results = [];
        const [month, day, year] = file.replace(/\.csv/, '').split('-');
        const date = new Date(year, month, day);
        fs.createReadStream(`${dataAbsPath}/${file}`)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => {
            // TODO: get the CSV types to get the row names
            // we also need a primary key and the date
            const insertStatement = `
              INSERT INTO daily_reports_us
              VALUES
                ${results
                  .map((j, k) => {
                    return `(
                    ${j} ${k}
                  )`;
                  })
                  .join(', \n')}
              ;
            `;
            console.log(insertStatement);
            // console.log(results);
            results.forEach((result) => {
              // console.log(result);
            });

            // TODO: perform the insert using AppDAO
          });
      });
    })
    .catch((reason) => {
      console.log('Some shit went wrong', reason);
    });
});

export default AppDAO;
