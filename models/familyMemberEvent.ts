import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import IFamilyMemberEvent from '../interfaces/IFamilyMemberEvent';

const getAllFamilyMemberEvents = async (
  sortBy = ''
): Promise<IFamilyMemberEvent[]> => {
  let sql = 'SELECT * FROM familyMemberEvents';
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }
  const results = await connection.promise().query<IFamilyMemberEvent[]>(sql);
  return results[0];
};

const getFamilyMemberEventById = async (
  idFamilyMemberEvent: number
): Promise<IFamilyMemberEvent> => {
  const [results] = await connection
    .promise()
    .query<IFamilyMemberEvent[]>(
      'SELECT * FROM familyMemberEvents WHERE id = ?',
      [idFamilyMemberEvent]
    );
  return results[0];
};

const addFamilyMemberEvent = async (
  familyMemberEvent: IFamilyMemberEvent
): Promise<number> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO familyMemberEvents (idFamilyMember, idEvent) VALUES (?, ?)',
      [familyMemberEvent.idFamilyMember, familyMemberEvent.idEvent]
    );
  return results[0].insertId;
};

const updateFamilyMemberEvent = async (
  idFamilyMemberEvent: number,
  familyMemberEvent: IFamilyMemberEvent
): Promise<boolean> => {
  let sql = 'UPDATE familyMemberEvents SET ';
  const sqlValues: Array<string | number> = [];
  let oneValue = false;

  if (familyMemberEvent.idEvent) {
    sql += 'idEvent = ? ';
    sqlValues.push(familyMemberEvent.idEvent);
    oneValue = true;
  }
  if (familyMemberEvent.idFamilyMember) {
    sql += oneValue ? ', idFamilyMember = ? ' : ' idFamilyMember = ? ';
    sqlValues.push(familyMemberEvent.idFamilyMember);
    oneValue = true;
  }
  sql += ' WHERE id = ?';
  sqlValues.push(idFamilyMemberEvent);

  const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
  return results[0].affectedRows === 1;
};

const deleteFamilyMemberEvent = async (
  idFamilyMemberEvent: number
): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM familyMemberEvents WHERE id = ?', [
      idFamilyMemberEvent,
    ]);
  return results[0].affectedRows === 1;
};

export {
  getAllFamilyMemberEvents,
  getFamilyMemberEventById,
  addFamilyMemberEvent,
  updateFamilyMemberEvent,
  deleteFamilyMemberEvent,
};
