import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import IRecipient from '../interfaces/IRecipient';

const getAllRecipient = async (sortBy = ''): Promise<IRecipient[]> => {
  let sql = 'SELECT * FROM recipients';
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }
  const results = await connection.promise().query<IRecipient[]>(sql);
  return results[0];
};

const getRecipientById = async (idRecipient: number): Promise<IRecipient> => {
  const [results] = await connection
    .promise()
    .query<IRecipient[]>('SELECT * FROM recipients WHERE id = ?', [
      idRecipient,
    ]);
  return results[0];
};

const getRecipientByName = async (idRecipient: number): Promise<IRecipient> => {
  const [results] = await connection
    .promise()
    .query<IRecipient[]>('SELECT * FROM recipients WHERE name = ?', [
      idRecipient,
    ]);
  return results[0];
};

const addRecipient = async (recipient: IRecipient): Promise<number> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO recipients (name) VALUES (?)', [
      recipient.name,
    ]);
  return results[0].insertId;
};

const deleteRecipient = async (idRecipient: number): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM recipient WHERE id = ?', [
      idRecipient,
    ]);
  return results[0].affectedRows === 1;
};

export {
  getAllRecipient,
  getRecipientById,
  getRecipientByName,
  addRecipient,
  deleteRecipient,
};
