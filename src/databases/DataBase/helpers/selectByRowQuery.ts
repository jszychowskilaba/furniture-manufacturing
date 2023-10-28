export const selectByRowQuery = (tableName: string, column: string) => {
  const query = `SELECT ${column} FROM ${tableName}`;
  return query;
};
