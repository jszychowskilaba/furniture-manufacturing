export const createSelectByQuery = (
  tableName: string,
  column: string,
) => {
  const query = `SELECT * FROM ${tableName} WHERE ${column} = $1 `;
  return query;
};
