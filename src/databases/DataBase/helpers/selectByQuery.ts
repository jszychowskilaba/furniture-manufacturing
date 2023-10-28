/**
 * Creates a select query given a table name, a column and a value
 * @param tableName The table name
 * @param column The column
 * @param value The value
 * @returns The row where there is a match
 */
export const selectByTableColumnValueQuery = (
  tableName: string,
  column: string,
  value: string,
) => {
  const query = `SELECT * FROM ${tableName} WHERE ${column} = '${value}' `;
  return query;
};
