import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import ILinkedDocument from '../interfaces/ILinkedDocument';

const getAllLinkedDocuments = async (
  sortBy = ''
): Promise<ILinkedDocument[]> => {
  let sql = 'SELECT * FROM linkedDocuments';
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }
  const results = await connection.promise().query<ILinkedDocument[]>(sql);
  return results[0];
};

const getLinkedDocumentById = async (
  idLinkedDocument: number
): Promise<ILinkedDocument> => {
  const [results] = await connection
    .promise()
    .query<ILinkedDocument[]>('SELECT * FROM linkedDocuments WHERE id = ?', [
      idLinkedDocument,
    ]);
  return results[0];
};

const addLinkedDocument = async (
  linkedDocument: ILinkedDocument
): Promise<number> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO linkedDocuments (idDocument, idEvent, idCommunication, idFamilyMember, idFamily) VALUES (?, ?, ?, ?, ?)',
      [
        linkedDocument.idDocument,
        linkedDocument.idEvent,
        linkedDocument.idCommunication,
        linkedDocument.idFamilyMember,
        linkedDocument.idFamily,
      ]
    );
  return results[0].insertId;
};

const updateLinkedDocument = async (
  idLinkedDocument: number,
  linkedDocument: ILinkedDocument
): Promise<boolean> => {
  let sql = 'UPDATE linkedDocuments SET ';
  const sqlValues: Array<string | number> = [];
  let oneValue = false;

  if (linkedDocument.idDocument) {
    sql += 'idDocument = ? ';
    sqlValues.push(linkedDocument.idDocument);
    oneValue = true;
  }
  if (linkedDocument.idEvent) {
    sql += oneValue ? ', idEvent = ? ' : ' idEvent = ? ';
    sqlValues.push(linkedDocument.idEvent);
    oneValue = true;
  }
  if (linkedDocument.idCommunication) {
    sql += 'idCommunication = ? ';
    sqlValues.push(linkedDocument.idCommunication);
    oneValue = true;
  }
  if (linkedDocument.idFamilyMember) {
    sql += oneValue ? ', idFamilyMember = ? ' : ' idFamilyMember = ? ';
    sqlValues.push(linkedDocument.idFamilyMember);
    oneValue = true;
  }
  if (linkedDocument.idFamily) {
    sql += oneValue ? ', idFamily = ? ' : ' idFamily = ? ';
    sqlValues.push(linkedDocument.idFamily);
    oneValue = true;
  }
  sql += ' WHERE id = ?';
  sqlValues.push(idLinkedDocument);

  const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
  return results[0].affectedRows === 1;
};

const deleteLinkedDocument = async (
  idLinkedDocument: number
): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM linkedDocuments WHERE id = ?', [
      idLinkedDocument,
    ]);
  return results[0].affectedRows === 1;
};

export {
  getAllLinkedDocuments,
  getLinkedDocumentById,
  addLinkedDocument,
  updateLinkedDocument,
  deleteLinkedDocument,
};
