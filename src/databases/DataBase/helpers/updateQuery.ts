/**
 * Updates a object in a given tableName, a dataObject where the properties
 * are taken as column and the properties values as values, and a column target and 
 * id target to identify the row to update.
 * @param tableName The table 
 * @param dataObject The data
 * @param columnTarget The column target
 * @param idTarget The id target
 * @returns 
 */
export const updateQuery = (
  tableName: string,
  dataObject: { [key: string]: unknown },
  columnTarget: string,
  idTarget: string
): string => {
  const columnValues = Object.keys(dataObject)
    .map((key) => `${key} = '${dataObject[key]}'`)
    .join(',');

  const query = `UPDATE ${tableName} SET ${columnValues} WHERE ${columnTarget} = '${idTarget}'`;

  return query;
};
