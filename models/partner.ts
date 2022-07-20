import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import IPartner from '../interfaces/IPartner';

const getAllPartners = async (sortBy = ''): Promise<IPartner[]> => {
  let sql = 'SELECT * FROM partners';
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }
  const results = await connection.promise().query<IPartner[]>(sql);
  return results[0];
};

const getPartnerById = async (idPartner: number): Promise<IPartner> => {
  const [results] = await connection
    .promise()
    .query<IPartner[]>('SELECT * FROM partners WHERE id = ?', [idPartner]);
  return results[0];
};

const getPartnerByName = async (idPartner: number): Promise<IPartner> => {
  const [results] = await connection
    .promise()
    .query<IPartner[]>('SELECT * FROM partners WHERE name = ?', [idPartner]);
  return results[0];
};

const addPartner = async (partner: IPartner): Promise<number> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO partners (name, logo, link) VALUES (?, ?, ?)',
      [partner.name, partner.logo, partner.link]
    );
  return results[0].insertId;
};

const updatedPartner = async (
  idPartner: number,
  partner: IPartner
): Promise<boolean> => {
  let sql = 'UPDATE partners SET';
  const sqlValues: Array<string | number | boolean> = [];
  let oneValue = false;

  if (partner.name) {
    sql += 'name = ? ';
    sqlValues.push(partner.name);
    oneValue = true;
  }
  if (partner.logo) {
    sql += oneValue ? ', logo = ? ' : 'logo = ? ';
    sqlValues.push(partner.logo);
    oneValue = true;
  }
  if (partner.link) {
    sql += oneValue ? ', link = ? ' : 'link = ? ';
    sqlValues.push(partner.link);
    oneValue = true;
  }
  sql += ' WHERE id = ?';
  sqlValues.push(idPartner);

  const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
  return results[0].affectedRows === 1;
};

const deletePartner = async (idPartner: number): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM partners WHERE id = ?', [idPartner]);
  return results[0].affectedRows === 1;
};

export {
  getAllPartners,
  getPartnerById,
  getPartnerByName,
  addPartner,
  updatedPartner,
  deletePartner,
};
