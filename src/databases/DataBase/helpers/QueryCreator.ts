class QueryCreator {
  /**
   * Creates a insert query given a table name and data to store
   * @param tableName The table name
   * @param dataObject The object. Property are taken as the column name,
   * and the property value as the column value.
   * @returns The query
   */
  insert(tableName: string, dataObject: object): string {
    const columns = Object.keys(dataObject).join(', ');
    const values = Object.values(dataObject)
      .map((value) => `'${value}'`)
      .join(', ');
    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;

    return query;
  }

  /**
   * Creates a select query given a table name, a column and a value
   * @param tableName The table name
   * @param column The column
   * @param value The value
   * @returns The row where there is a match
   */
  selectByTableColumnValue(
    tableName: string,
    column: string,
    value: string
  ) {
    const query = `SELECT * FROM ${tableName} WHERE ${column} = '${value}' `;
    return query;
  }

  /**
   * Create a select query given a table name and column
   * @param tableName The table name
   * @param column The column
   * @returns The row where there is a match
   */
  selectByColumn(tableName: string, column: string) {
    const query = `SELECT ${column} FROM ${tableName}`;
    return query;
  }

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
  update(
    tableName: string,
    dataObject: { [key: string]: unknown },
    columnTarget: string,
    idTarget: string
  ): string {
    const columnValues = Object.keys(dataObject)
      .map((key) => `${key} = '${dataObject[key]}'`)
      .join(',');

    const query = `UPDATE ${tableName} SET ${columnValues} WHERE ${columnTarget} = '${idTarget}'`;

    return query;
  }
}

export default new QueryCreator();
