class QueryCreator {
  /**
   * Creates a insert query given a table name and data to store
   * @param tableName The table name
   * @param dataObject The object. Property are taken as the column name,
   * and the property value as the column value.
   * @returns The query
   */
  insert(tableName: string, dataObject: object): string {
    const columns = Object.keys(dataObject)
      .map((column) => `"${column}"`)
      .join(', ');
    const values = Object.values(dataObject)
      .map((value) => `'${value}'`)
      .join(', ');
    const query = `INSERT INTO "${tableName}" (${columns}) VALUES (${values})`;

    return query;
  }

  /**
   * Creates a select query given a table name, a column and a value
   * @param tableName The table name
   * @param column The column
   * @param value The value
   * @returns The row where there is a match
   */
  selectByTableColumnValue(tableName: string, column: string, value: string) {
    const query = `SELECT * FROM "${tableName}" WHERE "${column}" = '${value}' `;
    return query;
  }

  /**
   * Create a select query given a table name and column
   * @param tableName The table name
   * @param column The column
   * @returns The row where there is a match
   */
  selectByColumn(tableName: string, column: string) {
    const newColumn = column == '*' ? '*' : `"${column}"`;
    const query = `SELECT ${newColumn} FROM "${tableName}"`;
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
      .map((key) => `"${key}" = '${dataObject[key]}'`)
      .join(',');

    const query = `UPDATE "${tableName}" SET ${columnValues} WHERE "${columnTarget}" = '${idTarget}'`;

    return query;
  }

  /**
   * Create a select query given a query parameter lists and a table name. The query
   * parameter list is taken as an object, where the object key is taken as the
   * column and the value as the filter value.
   * The next properties are taken as special features:
   * - orderBy: for ordering by a certain column
   * - pages: for limiting the number of pages to show
   * - pageOffset: for adding a offset to the pages to show
   * @param tableName The table name
   * @param queryParams The query parameters
   * @param column The column name, default is '*'
   * @returns
   */
  selectByQueryParams(
    tableName: string,
    queryParams: object,
    column: string = '*'
  ) {
    const specialFilters = ['orderBy', 'pages', 'pageOffset'];

    let query = `SELECT ${column} FROM "${tableName}" WHERE `;
    let queriesPresent = false;

    for (const [key, value] of Object.entries(queryParams)) {
      if (specialFilters.includes(key)) continue;
      query = query.concat(`"${key}" = '${value}' AND `);
      queriesPresent = true;
    }

    if (queriesPresent) {
      // removes last "AND"
      query = query.slice(0, -5);
    } else {
      // removes "WHERE" as there are not queries
      query = query.slice(0, -7);
    }

    // adding orderBy if exists
    if (queryParams['orderBy' as keyof object])
      query = query.concat(
        ` ORDER BY "${queryParams['orderBy' as keyof object]}"`
      );

    // adding pagination if exists
    if (queryParams['pages' as keyof object]) {
      query = query.concat(` LIMIT ${queryParams['pages' as keyof object]}`);
    }

    // adding pageOffset if exists
    if (queryParams['pageOffset' as keyof object]) {
      query = query.concat(
        `  OFFSET ${queryParams['pageOffset' as keyof object]}`
      );
    }

    return query;
  }
}

export default new QueryCreator();
