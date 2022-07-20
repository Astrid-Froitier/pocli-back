import { ResultSetHeader } from 'mysql2';
import connection from '../db-config.js';
import IDocumentType from '../interfaces/IDocumentType';

const getAllDocumentTypes = async (sortBy = ''): Promise<IDocumentType[]> => {
  let sql = 'SELECT * FROM documentTypes';
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }
  const results = await connection.promise().query<IDocumentType[]>(sql);
  return results[0];
};

const getDocumentTypeById = async (
  idDocumentType: number
): Promise<IDocumentType> => {
  const [results] = await connection
    .promise()
    .query<IDocumentType[]>('SELECT * FROM documentTypes WHERE id = ?', [
      idDocumentType,
    ]);
  return results[0];
};

const addDocumentType = async (
  documentType: IDocumentType
): Promise<number> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO documentTypes (name) VALUES (?)', [
      documentType.name,
    ]);
  return results[0].insertId;
};

const updateDocumentType = async (
  idDocumentType: number,
  documentType: IDocumentType
): Promise<boolean> => {
  let sql = 'UPDATE documentTypes SET ';
  const sqlValues: Array<string | number> = [];
  if (documentType.name) {
    sql += 'name = ? ';
    sqlValues.push(String(DocumentType.name));
  }
  sql += ' WHERE id = ?';
  sqlValues.push(idDocumentType);

  const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
  return results[0].affectedRows === 1;
};

const deleteDocumentType = async (idDocumentType: number): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM documentTypes WHERE id = ?', [
      idDocumentType,
    ]);
  return results[0].affectedRows === 1;
};

export {
  getAllDocumentTypes,
  getDocumentTypeById,
  addDocumentType,
  updateDocumentType,
  deleteDocumentType,
};
