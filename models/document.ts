import connection from '../db-config';
import { ResultSetHeader } from 'mysql2';
import IDocument from '../interfaces/IDocument';

const getAllDocuments = async (sortBy = ''): Promise<IDocument[]> => {
  let sql = `SELECT * FROM documents`;
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }
  const results = await connection.promise().query<IDocument[]>(sql);
  return results[0];
};

const getDocumentById = async (idDocument: number): Promise<IDocument> => {
  const [results] = await connection
    .promise()
    .query<IDocument[]>('SELECT * FROM documents WHERE id = ?', [idDocument]);
  return results[0];
};

const addDocument = async (document: IDocument): Promise<number> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO documents (name, url) VALUES (?, ?)', [
      document.name,
      document.url,
    ]);
  return results[0].insertId;
};

const updateDocument = async (
  idDocument: number,
  document: IDocument
): Promise<boolean> => {
  let sql = 'UPDATE documents SET ';
  const sqlValues: Array<string | number> = [];
  let oneValue = false;

  if (document.name) {
    sql += 'name = ? ';
    sqlValues.push(document.name);
    oneValue = true;
  }
  if (document.url) {
    sql += oneValue ? ', url = ? ' : ' url = ? ';
    sqlValues.push(document.url);
    oneValue = true;
  }
  sql += ' WHERE id = ?';
  sqlValues.push(idDocument);

  const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
  return results[0].affectedRows === 1;
};

const deleteDocument = async (idDocument: number): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM documents WHERE id = ?', [idDocument]);
  return results[0].affectedRows === 1;
};

export {
  getAllDocuments,
  getDocumentById,
  addDocument,
  updateDocument,
  deleteDocument,
};
