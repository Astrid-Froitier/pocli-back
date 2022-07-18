import connection from '../db-config';
import { ResultSetHeader } from 'mysql2';
import INewsletter from '../interfaces/INewsletter';

const getAllNewsletters = async (sortBy = ''): Promise<INewsletter[]> => {
  let sql = `SELECT * FROM newsletters`;
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }
  const results = await connection.promise().query<INewsletter[]>(sql);
  return results[0];
};

const getNewsletterById = async (
  idNewsletter: number
): Promise<INewsletter> => {
  const [results] = await connection
    .promise()
    .query<INewsletter[]>('SELECT * FROM newsletters WHERE id = ?', [
      idNewsletter,
    ]);
  return results[0];
};

const addNewsletter = async (Newsletter: INewsletter): Promise<number> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO newsletters (email) VALUES (?)', [
      Newsletter.email,
    ]);
  return results[0].insertId;
};

const updateNewsletter = async (
  idNewsletter: number,
  newsletter: INewsletter
): Promise<boolean> => {
  let sql = 'UPDATE newsletters SET ';
  const sqlValues: Array<string | number> = [];
  if (newsletter.email) {
    sql += 'email = ? ';
    sqlValues.push(String(newsletter.email));
  }
  sql += ' WHERE id = ?';
  sqlValues.push(idNewsletter);

  const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
  return results[0].affectedRows === 1;
};

const deleteNewsletter = async (idNewsletter: number): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM newsletters WHERE id = ?', [
      idNewsletter,
    ]);
  return results[0].affectedRows === 1;
};

export {
  getAllNewsletters,
  getNewsletterById,
  addNewsletter,
  updateNewsletter,
  deleteNewsletter,
};
