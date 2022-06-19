import { ResultSetHeader } from 'mysql2';
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

const addCity = async (city: ICity): Promise<number> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO cities (name, zipCode) VALUES (?, ?)',
      [city.name, city.zipCode]
    );
  return results[0].insertId;
};

export { getAllCities, getCityById, addCity };
