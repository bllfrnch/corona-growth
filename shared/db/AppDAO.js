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

export default AppDAO;
