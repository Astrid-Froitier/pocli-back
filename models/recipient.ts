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
      .query<IRecipient[]>('SELECT * FROM recipients WHERE id = ?', [idRecipient]);
    return results[0];
  };

  const getRecipientByName = async (idRecipient: number): Promise<IRecipient> => {
    const [results] = await connection
      .promise()
      .query<IRecipient[]>('SELECT * FROM recipients WHERE name = ?', [idRecipient]);
    return results[0];
  };

  export {
    getAllRecipient,
    getRecipientById,
    getRecipientByName,
  };