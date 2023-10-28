/**
 * Creates a insert query given a table name and data to store
 * @param tableName The table name
 * @param dataObject The object. Property are taken as the column name,
 * and the property value as the column value.
 * @returns The query
 */
export const insertQuery = (tableName: string, dataObject: object): string => {
  const columns = Object.keys(dataObject).join(', ');
  const values = Object.values(dataObject)
    .map((value) => `'${value}'`)
    .join(', ');
  const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;

  return query;
};
