export const createInsertQuery = (tableName: string, dataObject: object) => {
  const columns = Object.keys(dataObject).join(', ');
  const values = Object.values(dataObject)
    .map((value) => `'${value}'`)
    .join(', ');
  const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;

  return query;
};
