import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import IPocliMember from '../interfaces/IPocliMember';

const getAllPocliMembers = async (sortBy = ''): Promise<IPocliMember[]> => {
  let sql = 'SELECT * FROM pocliMembers';
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }
  const results = await connection.promise().query<IPocliMember[]>(sql);
  return results[0];
};

const getPocliMemberById = async (idPocliMember: number): Promise<IPocliMember> => {
  const [results] = await connection
    .promise()
    .query<IPocliMember[]>('SELECT * FROM pocliMembers WHERE id = ?', [idPocliMember]);
  return results[0];
};

const addPocliMember = async (pocliMember: IPocliMember): Promise<number> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO pocliMembers (firstname, lastname, function, url) VALUES (?, ?, ?, ?)',
      [pocliMember.firstname, pocliMember.lastname, pocliMember.function, pocliMember.url]
    );
  return results[0].insertId;
};

const updatedPocliMember = async (
  idPocliMember: number,
  pocliMember: IPocliMember
): Promise<boolean> => {
  let sql = 'UPDATE pocliMembers SET';
  const sqlValues: Array<string | number> = [];
  let oneValue = false;

  if (pocliMember.firstname) {
    sql += 'firstname = ? ';
    sqlValues.push(pocliMember.firstname);
    oneValue = true;
  }
  if (pocliMember.lastname) {
    sql += oneValue ? ', lastname = ? ' : 'lastname = ? ';
    sqlValues.push(pocliMember.lastname);
    oneValue = true;
  }
  if (pocliMember.function) {
    sql += oneValue ? ', function = ? ' : 'function = ? ';
    sqlValues.push(pocliMember.function);
    oneValue = true;
  }
  if (pocliMember.url) {
    sql += oneValue ? ', url = ? ' : 'url = ? ';
    sqlValues.push(pocliMember.url);
    oneValue = true;
  }
  sql += ' WHERE id = ?';
  sqlValues.push(idPocliMember);

  const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
  return results[0].affectedRows === 1;
};

const deletePocliMember = async (idPocliMember: number): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM pocliMembers WHERE id = ?', [idPocliMember]);
  return results[0].affectedRows === 1;
};

export {
  getAllPocliMembers,
  getPocliMemberById,
  addPocliMember,
  updatedPocliMember,
  deletePocliMember,
};
