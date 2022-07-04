import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import IEventDocument from '../interfaces/IEventDocument';

const getAllEventDocuments = async (sortBy = ''): Promise<IEventDocument[]> => {
  let sql = 'SELECT * FROM eventDocuments';
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }
  const results = await connection.promise().query<IEventDocument[]>(sql);
  return results[0];
};

const getEventDocumentById = async (
  idEventDocument: number
): Promise<IEventDocument> => {
  const [results] = await connection
    .promise()
    .query<IEventDocument[]>('SELECT * FROM eventDocuments WHERE id = ?', [
      idEventDocument,
    ]);
  return results[0];
};

const getEventDocumentByEvent = async (
  idEvent: number
): Promise<IEventDocument[]> => {
  const results = await connection
    .promise()
    .query<IEventDocument[]>('SELECT * FROM eventDocuments WHERE idEvent = ?', [
      idEvent,
    ]);
  return results[0];
};

const getEventDocumentByDocument = async (
  idDocument: number
): Promise<IEventDocument[]> => {
  const results = await connection
    .promise()
    .query<IEventDocument[]>(
      'SELECT * FROM eventDocuments WHERE idDocument = ?',
      [idDocument]
    );
  return results[0];
};

const addEventDocument = async (
  eventDocument: IEventDocument
): Promise<number> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO eventDocuments (idDocument, idEvent) VALUES (?, ?)',
      [eventDocument.idDocument, eventDocument.idEvent]
    );
  return results[0].insertId;
};

const updateEventDocument = async (
  idEventDocument: number,
  eventDocument: IEventDocument
): Promise<boolean> => {
  let sql = 'UPDATE eventDocuments SET ';
  const sqlValues: Array<string | number> = [];
  let oneValue = false;

  if (eventDocument.idDocument) {
    sql += 'idDocument = ? ';
    sqlValues.push(eventDocument.idDocument);
    oneValue = true;
  }
  if (eventDocument.idEvent) {
    sql += oneValue ? ', idEvent = ? ' : ' idEvent = ? ';
    sqlValues.push(eventDocument.idEvent);
    oneValue = true;
  }
  sql += ' WHERE id = ?';
  sqlValues.push(idEventDocument);

  const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
  return results[0].affectedRows === 1;
};

const deleteEventDocument = async (
  idEventDocument: number
): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM eventDocuments WHERE id = ?', [
      idEventDocument,
    ]);
  return results[0].affectedRows === 1;
};

const deleteEventDocumentByDocument = async (
  idDocument: number
): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM eventDocuments WHERE idDocument = ?', [
      idDocument,
    ]);
  return results[0].affectedRows > 1;
};

const deleteEventDocumentByEvent = async (
  idEvent: number
): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM eventDocuments WHERE idEvent = ?', [
      idEvent,
    ]);
  return results[0].affectedRows > 1;
};

export {
  getAllEventDocuments,
  getEventDocumentById,
  getEventDocumentByEvent,
  getEventDocumentByDocument,
  addEventDocument,
  updateEventDocument,
  deleteEventDocument,
  deleteEventDocumentByDocument,
  deleteEventDocumentByEvent,
};
