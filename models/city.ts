import connection from '../db-config';
import ICity from '../interfaces/ICity';

const getAllCities = async (sortBy = ''): Promise<ICity[]> => {
  let sql = `SELECT id, name, zipCode FROM cities`;
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }
  const results = await connection.promise().query<ICity[]>(sql);
  return results[0];
};

const getCityById = async (idCity: number): Promise<ICity> => {
  const [results] = await connection
    .promise()
    .query<ICity[]>('SELECT id, name, zipCode FROM cities WHERE id = ?', [
      idCity,
    ]);
  return results[0];
};

export { getAllCities, getCityById };
