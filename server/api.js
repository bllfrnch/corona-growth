import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import moment from 'moment';
import { dbPath, dailyReportsUS } from '../shared/db/constants';

const api = express.Router();
// TODO: Is there a way to pool these connection objects?

let db = null;

const connect = async () => {
  // open the database
  db = await open({
    filename: dbPath,
    driver: sqlite3.cached.Database,
  });
};

// Get a list of all countries and regions
api.get('/api/countryRegions', (req, res) => {
  res.status(501, {
    status: 501,
    error: `${req.path} not implemented`,
  });
});

// Hit this endpoint at your risk.
// Get all data for country or region specified by :countryRegion
api.get('/api/cases/country/:countryRegion', (req, res) => {
  const { countryRegion } = req.params;
  connect().then(() => {
    db.all(
      `
        SELECT * 
        FROM ${dailyReportsUS}
        WHERE country_region = ?
        ORDER BY date, province_state
        
      `,
      countryRegion
    )
      .then((results) => {
        res.send({
          results,
        });
      })
      .catch((err) => {
        console.error('Error! ', err);
        res.status(500).send({
          status: 500,
          error: err,
        });
      });
  });
});

// Get all data, by day, for each a state or province
api.get('/api/cases/country/:countryRegion/:provinceState', (req, res) => {
  const { countryRegion, provinceState } = req.params;
  connect().then(() => {
    db.all(
      `
        SELECT * 
        FROM ${dailyReportsUS}
        WHERE country_region = ? AND province_state = ?
        ORDER BY date
        
      `,
      [countryRegion, provinceState]
    )
      .then((results) => {
        res.send({
          results,
        });
      })
      .catch((err) => {
        console.error('Error! ', err);
        res.status(500).send({
          status: 500,
          error: err,
        });
      });
  });
});

// Get all data for a date and given country/region. If query string parameter "previousDays"
// is specified, then get data for the previous days too.
api.get('/api/cases/date/:date/:countryRegion', (req, res) => {
  const { countryRegion, date } = req.params;
  const previousDays = req.query.previousDays || 0;
  const maxDate = date;
  const minDate = moment(maxDate).subtract(previousDays, 'days').format('YYYY-MM-DD');

  connect().then(() => {
    db.all(
      `
        SELECT *
        FROM ${dailyReportsUS}
        WHERE country_region = ?
        AND date BETWEEN ? AND ?
        ORDER BY date, province_state
      `,
      [countryRegion, minDate, maxDate]
    )
      .then((results) => {
        res.send({
          results,
        });
      })
      .catch((err) => {
        console.error('Error! ', err);
        res.status(500).send({
          status: 500,
          error: err,
        });
      });
  });
});

api.get('/api/cases/date/:date/:countryRegion/:provinceState', (req, res) => {
  const { countryRegion, date, provinceState } = req.params;
  const previousDays = req.query.previousDays || 0;
  const maxDate = date;
  const minDate = moment(maxDate).subtract(previousDays, 'days').format('YYYY-MM-DD');

  connect().then(() => {
    db.all(
      `
        SELECT *
        FROM ${dailyReportsUS}
        WHERE country_region = ?
          AND province_state = ?
          AND date BETWEEN ? AND ?
        ORDER BY date, province_state
      `,
      [countryRegion, provinceState, minDate, maxDate]
    )
      .then((results) => {
        res.send({
          results,
        });
      })
      .catch((err) => {
        console.error('Error! ', err);
        res.status(500).send({
          status: 500,
          error: err,
        });
      });
  });
});

export default api;
