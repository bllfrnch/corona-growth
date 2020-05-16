import fs from 'fs';
import path from 'path';
import sqlite from 'sqlite3';

class AppDAO {
  constructor(dbFilePath) {
    this.db = new sqlite.Database(dbFilePath, (err) => {
      if (err) {
        console.log('Could not connect to database', err);
      } else {
        console.log('Connected to database');
      }
    })
  }
}

const args = process.argv.slice(2);
const dbPath = args.find(arg => arg.startsWith('db=')).replace(/db=/, '');
const dataPath = args.find(arg => arg.startsWith('dataDir=')).replace(/dataDir=/, '');
const dbAbsPath = path.resolve(dbPath);
const dataAbsPath = path.resolve(dataPath);

console.log(args);
console.log(dbAbsPath);
console.log(dataAbsPath);

fs.readdir(dataAbsPath, (err, files) => {
  // handling error
  if (err) {
    console.log(`Unable to scan directory: ${err}`);
  }
  // listing all files using forEach
  files.forEach(function (file) {
    // Do whatever you want to do with the file
    console.log(file);
  });
});

// const appDao = new AppDAO(dbAbsPath);

// console.log(`Creating database at ${dbAbsPath}`);

export default AppDAO;
