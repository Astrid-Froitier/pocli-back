import connection from '../db-config';
import ICommunication from '../interfaces/ICommunication';
import { ResultSetHeader } from 'mysql2';

const getAllCommunications = async (sortBy = ''): Promise<ICommunication[]> => {
  let sql = `SELECT id, object, content, isOpened, idAdmin, isBanner FROM communications`;
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }
  const results = await connection.promise().query<ICommunication[]>(sql);
  return results[0];
};

const getCommunicationById = async (
  idCommunication: number
): Promise<ICommunication> => {
  const [results] = await connection
    .promise()
    .query<ICommunication[]>(
      'SELECT id, object, content, isOpened, idAdmin, isBanner FROM communications WHERE id = ?',
      [idCommunication]
    );
  return results[0];
};

const addCommunication = async (
  communication: ICommunication
): Promise<number> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO communications (object, content, isOpened, idAdmin, isBanner) VALUES (?, ?, ?, ?, ?, ?)',
      [
        communication.object,
        communication.content,
        communication.isOpened,
        communication.idAdmin,
        communication.isBanner,
      ]
    );
  return results[0].insertId;
};

const deleteCommunication = async (
  idCommunication: number
): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM communications WHERE id = ?', [
      idCommunication,
    ]);
  return results[0].affectedRows === 1;
};

export {
  getAllCommunications,
  getCommunicationById,
  addCommunication,
  deleteCommunication,
};
