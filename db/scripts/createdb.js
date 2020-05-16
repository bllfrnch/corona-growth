import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import sqlite from 'sqlite3';

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
  let headers;

  // handling error
  if (err) {
    throw new Error(`Unable to scan directory: ${err}`);
  }

  if (!files.length) {
    throw new Error(`No files to read!`);
  }

  const headerPromise = new Promise((resolve, reject) => {
    // Get field names from first data file
    const first = files.find((file) => file.match(/^\d{2,}-\d{2,}-\d{4,}/));
    console.log(first);
    if (first) {
      console.log(`Yes, reading ${dataAbsPath}/${first}`);
      fs.createReadStream(`${dataAbsPath}/${first}`)
        .pipe(csv())
        .on('headers', (h) => {
          console.log(`headers ${h}`);
          headers = h;
          resolve();
        });
    } else {
      reject(new Error('No headers found'));
    }
  });

  // Create table
  // appDao.run(`CREATE TABLE IF NOT EXISTS daily_reports_us (
  //   id INTEGER PRIMARY KEY AUTOINCREMENT,
  //   date DATE,

  // )`);

  // listing all files using forEach
  headerPromise
    .then(() => {
      console.log('headers: ', headers);
      files.forEach((file) => {
        const results = [];
        const [month, day, year] = file.replace(/\.csv/, '').split('-');
        const date = new Date(year, month, day);
        console.log(date);
        fs.createReadStream(`${dataAbsPath}/${file}`)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => {
            // TODO: get the CSV types to get the row names
            // we also need a primary key and the date
            let insertStatement = '';
            console.log(results);
            results.forEach((result) => {
              // TODO: build up the values
            });

            // TODO: perform the insert using AppDAO
          });
      });
    })
    .catch((reason) => {
      console.log('Some shit went wrong');
    });
});

export default AppDAO;
