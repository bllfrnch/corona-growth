import * as constants from './constants';

const buildColumnSql = (name, props) => {
  let colSql = '';
  // type is the default prop, can be passed as a string
  if (typeof props === 'string') {
    colSql = `${name} ${props}`;
    // otherwise there's more work to do
  } else if (typeof props === 'object') {
    colSql = `${name} ${props.type}`;
    if (props.primaryKey) colSql = colSql.concat(' PRIMARY KEY');
    if (props.autoIncrement) colSql = colSql.concat(' AUTOINCREMENT');
  }
  return colSql;
};

export const scrubInteger = (num) => {
  return Number(String(num).replace(/,/, ''));
};

export const buildCreateTableSql = (tableDef) => {
  return `
    CREATE TABLE IF NOT EXISTS ${tableDef.name} (
      ${Object.keys(tableDef.columns)
        .map((k) => {
          return buildColumnSql(k, tableDef.columns[k]);
        })
        .join(',\n')}     
    )
  `;
};

export const buildInsertSql = (tableDef, data, colDef) => {
  let cols;
  const tableDefCols = Object.keys(tableDef.columns);
  // specific column names
  if (colDef instanceof Array) {
    cols = colDef;
    // we're mapping data's object property to a different column name
  } else if (typeof colDef == 'object') {
    cols = tableDefCols.reduce((acc, curr) => {
      if (tableDefCols.indexOf(curr) !== -1) acc.push(curr);
      return acc;
    }, []);
    // we simply use the cols specified in tableDef
  } else {
    cols = tableDefCols;
  }
  return `
    INSERT INTO ${tableDef.name}
      (
        ${cols.join(', ')}
      )
    VALUES ${data.map((row) => {
      return `(
          ${cols
            .map((col) => {
              const isText =
                tableDef.columns[col] === 'TEXT' || tableDef.columns[col]?.type === 'TEXT';
              const isMappedColName = typeof colDef === 'object' && !(colDef instanceof Array);
              const isAutoincrement = tableDef.columns[col]?.autoIncrement;
              const value = isMappedColName ? row[colDef[col]] : row[col];
              return isAutoincrement ? 'null' : isText ? `"${value}"` : value;
            })
            .join(', ')}
        )`;
    })}
  `;
};
