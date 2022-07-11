import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import IFamilyMemberActivity from '../interfaces/IFamilyMemberActivity';

const getAllFamilyMemberActivities = async (
  sortBy = ''
): Promise<IFamilyMemberActivity[]> => {
  let sql = 'SELECT * FROM familyMemberActivities';
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }
  const results = await connection
    .promise()
    .query<IFamilyMemberActivity[]>(sql);
  return results[0];
};

const getFamilyMemberActivityById = async (
  idFamilyMemberActivity: number
): Promise<IFamilyMemberActivity> => {
  const [results] = await connection
    .promise()
    .query<IFamilyMemberActivity[]>(
      'SELECT * FROM familyMemberActivities WHERE id = ?',
      [idFamilyMemberActivity]
    );
  return results[0];
};

const addFamilyMemberActivity = async (
  familyMemberActivity: IFamilyMemberActivity
): Promise<number> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO familyMemberActivities (idActivity, idEvent) VALUES (?, ?)',
      [familyMemberActivity.idActivity, familyMemberActivity.idEvent]
    );
  return results[0].insertId;
};

const updateFamilyMemberActivity = async (
  idFamilyMemberActivity: number,
  familyMemberActivity: IFamilyMemberActivity
): Promise<boolean> => {
  let sql = 'UPDATE familyMemberActivities SET ';
  const sqlValues: Array<number> = [];
  let oneValue = false;

  if (familyMemberActivity.idDocument) {
    sql += 'idDocument = ? ';
    sqlValues.push(Number(familyMemberActivity.idDocument));
    oneValue = true;
  }
  if (familyMemberActivity.idEvent) {
    sql += oneValue ? ', idEvent = ? ' : ' idEvent = ? ';
    sqlValues.push(Number(familyMemberActivity.idEvent));
    oneValue = true;
  }
  sql += ' WHERE id = ?';
  sqlValues.push(idFamilyMemberActivity);

  const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
  return results[0].affectedRows === 1;
};

const deleteFamilyMemberActivity = async (
  idFamilyMemberActivity: number
): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM familyMemberActivities WHERE id = ?', [
      idFamilyMemberActivity,
    ]);
  return results[0].affectedRows === 1;
};

export {
  getAllFamilyMemberActivities,
  getFamilyMemberActivityById,
  addFamilyMemberActivity,
  updateFamilyMemberActivity,
  deleteFamilyMemberActivity,
};
