import connection from '../db-config';
import ICommunication from '../interfaces/ICommunication';
import { ResultSetHeader } from 'mysql2';

const getAllCommunications = async (sortBy = ''): Promise<ICommunication[]> => {
  let sql = `SELECT * FROM communications`;
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
      'SELECT * FROM communications WHERE id = ?',
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
      'INSERT INTO communications (object, content, date, idAdmin) VALUES (?, ?, ?, ?)',
      [
        communication.object,
        communication.content,
        communication.date,
        communication.idAdmin
      ]
    );
  return results[0].insertId;
};

const updateCommunication = async (
  idCommunication: number,
  communication: ICommunication
): Promise<boolean> => {
  let sql = 'UPDATE communications SET ';
  const sqlValues: Array<string | number> = [];
  let oneValue = false;

  if (communication.object) {
    sql += 'object = ? ';
    sqlValues.push(communication.object);
    oneValue = true;
  }
  if (communication.content) {
    sql += oneValue ? ', content = ? ' : ' content = ? ';
    sqlValues.push(communication.content);
    oneValue = true;
  }
  if (communication.date) {
    sql += oneValue ? ', date = ? ' : ' date = ? ';
    sqlValues.push(communication.date);
    oneValue = true;
  }
  if (communication.idAdmin) {
    sql += oneValue ? ', idAdmin = ? ' : ' idAdmin = ? ';
    sqlValues.push(communication.idAdmin);
    oneValue = true;
  }
  sql += ' WHERE id = ?';
  sqlValues.push(idCommunication);

  const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
  return results[0].affectedRows === 1;
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
  updateCommunication,
  deleteCommunication,
};
