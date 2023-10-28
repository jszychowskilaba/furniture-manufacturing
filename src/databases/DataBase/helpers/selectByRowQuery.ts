/**
 * Create a select query given a table name and column
 * @param tableName The table name
 * @param column The column
 * @returns The row where there is a match
 */
export const selectByRowQuery = (tableName: string, column: string) => {
  const query = `SELECT ${column} FROM ${tableName}`;
  return query;
};
