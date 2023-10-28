export const selectByTableColumnValueQuery = (
  tableName: string,
  column: string,
  value: string,
) => {
  const query = `SELECT * FROM ${tableName} WHERE ${column} = '${value}' `;
  return query;
};
