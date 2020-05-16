import sqlite from 'sqlite3';
import path from 'path';

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
const dbAbsPath = path.normalize(dbPath);

const appDao = new AppDAO(dbAbsPath);

console.log(`Creating database at ${dbAbsPath}`);

export default AppDAO;
