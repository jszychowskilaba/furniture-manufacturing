import QueryCreator from '../../repositories/helpers/QueryCreator';

describe('Testing query creator', () => {
  test('Expect to create db query', () => {
    const tableName = 'testTable';

    const queryParams = {
      query1: 1,
      query2: 2,
      query3: 3,
    };

    expect(QueryCreator.selectByQueryParams(tableName, queryParams)).toMatch(
      `SELECT * FROM "${tableName}" WHERE "query1" = '1' AND "query2" = '2' AND "query3" = '3'`
    );
  });

  test('Expect to create pagination query', () => {
    const tableName = 'testTable';

    const queryParams = {
      pages: 5,
      pageOffset: 2,
    };

    expect(QueryCreator.selectByQueryParams(tableName, queryParams)).toMatch(
      `SELECT * FROM "${tableName}" LIMIT 5  OFFSET 2`
    );
  });

  test('Expect to create orderBy query', () => {
    const tableName = 'testTable';

    const queryParams = {
      orderBy: 'someColumn',
    };

    expect(QueryCreator.selectByQueryParams(tableName, queryParams)).toMatch(
      `SELECT * FROM "${tableName}" ORDER BY "someColumn"`
    );
  });

  test('Expect to create complex query with special queries in correct order', () => {
    const tableName = 'testTable';

    const queryParams = {
      pages: 5,
      orderBy: 'someColumn',
      query2: 2,
      pageOffset: 3,
      query1: 1,
    };

    expect(QueryCreator.selectByQueryParams(tableName, queryParams)).toMatch(
      `SELECT * FROM "${tableName}" WHERE "query2" = '2' AND "query1" = '1' ORDER BY "someColumn" LIMIT 5  OFFSET 3`
    );
  });
});
