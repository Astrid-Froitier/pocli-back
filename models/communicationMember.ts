import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import ICommunicationMember from '../interfaces/ICommunicationMember';

const getAllCommunicationMembers = async (
  sortBy = ''
): Promise<ICommunicationMember[]> => {
  let sql = 'SELECT * FROM communicationMembers';
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }
  const results = await connection.promise().query<ICommunicationMember[]>(sql);
  return results[0];
};

const getCommunicationMemberById = async (
  idCommunicationMember: number
): Promise<ICommunicationMember> => {
  const [results] = await connection
    .promise()
    .query<ICommunicationMember[]>(
      'SELECT * FROM communicationMembers WHERE id = ?',
      [idCommunicationMember]
    );
  return results[0];
};

const getAllCommunicationMembersByIdFamily = async (
  idFamily: number
): Promise<ICommunicationMember[]> => {
  const [results] = await connection
    .promise()
    .query<ICommunicationMember[]>(
      'SELECT * FROM communicationMembers WHERE idFamily = ?',
      [idFamily]
    );
  return results;
};

const addCommunicationMember = async (
  communicationMember: ICommunicationMember
): Promise<number> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO communicationMembers (idFamilyMember, idFamily, idActivity, idCommunication, isOpened, isTrashed, isBanner) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        communicationMember.idFamilyMember,
        communicationMember.idFamily,
        communicationMember.idActivity,
        communicationMember.idCommunication,
        communicationMember.isOpened,
        communicationMember.isTrashed,
        communicationMember.isBanner
      ]
    );
  return results[0].insertId;
};

const updateCommunicationMember = async (
  idCommunicationMember: number,
  communicationMember: ICommunicationMember
): Promise<boolean> => {
  let sql = 'UPDATE communicationMembers SET ';
  const sqlValues: Array<string | number> = [];
  let oneValue = false;

  if (communicationMember.idFamilyMember) {
    sql += 'idFamilyMember = ? ';
    sqlValues.push(communicationMember.idFamilyMember);
    oneValue = true;
  }
  if (communicationMember.idFamily) {
    sql += oneValue ? ', idFamily = ? ' : ' idFamily = ? ';
    sqlValues.push(communicationMember.idFamily);
    oneValue = true;
  }
  if (communicationMember.idActivity) {
    sql += oneValue ? ', idActivity = ? ' : ' idActivity = ? ';
    sqlValues.push(communicationMember.idActivity);
    oneValue = true;
  }
  if (communicationMember.idCommunication) {
    sql += oneValue ? ', idCommunication = ? ' : ' idCommunication = ? ';
    sqlValues.push(communicationMember.idCommunication);
    oneValue = true;
  }
  if (communicationMember.isOpened) {
    sql += oneValue ? ', isOpened = ? ' : ' isOpened = ? ';
    sqlValues.push(communicationMember.isOpened);
    oneValue = true;
  }
  if (communicationMember.isTrashed) {
    sql += oneValue ? ', isTrashed = ? ' : ' isTrashed = ? ';
    sqlValues.push(communicationMember.isTrashed);
    oneValue = true;
  }
  if (communicationMember.isBanner) {
    sql += oneValue ? ', isBanner = ? ' : ' isBanner = ? ';
    sqlValues.push(communicationMember.isBanner);
    oneValue = true;
  }
  sql += ' WHERE id = ?';
  sqlValues.push(idCommunicationMember);

  const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
  return results[0].affectedRows === 1;
};

const deleteCommunicationMember = async (
  idCommunicationMember: number
): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM communicationMembers WHERE id = ?', [
      idCommunicationMember,
    ]);
  return results[0].affectedRows === 1;
};

export {
  getAllCommunicationMembers,
  getCommunicationMemberById,
  getAllCommunicationMembersByIdFamily,
  addCommunicationMember,
  updateCommunicationMember,
  deleteCommunicationMember,
};
