import connection from '../db-config';
import IHistoryNew from '../interfaces/IHistoryNew';
import { ResultSetHeader } from 'mysql2';

const getAllHistoryNews = async (sortBy = ''): Promise<IHistoryNew[]> => {
  let sql = `SELECT id, date, streetNumber, address, zipCode, city, hours, numberOfParticipants, idUserPost, idUserAdmin, idNew FROM historyNews`;
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }
  const results = await connection.promise().query<IHistoryNew[]>(sql);
  return results[0];
};

const getHistoryNewById = async (
  idHistoryNew: number
): Promise<IHistoryNew> => {
  const [results] = await connection
    .promise()
    .query<IHistoryNew[]>(
      'SELECT id, date, streetNumber, address, zipCode, city, hours, numberOfParticipants, idUserPost, idUserAdmin, idNew FROM historyNews WHERE id = ?',
      [idHistoryNew]
    );
  return results[0];
};

const addHistoryNew = async (historyNew: IHistoryNew): Promise<number> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO historyNews (date, streetNumber, address, zipCode, city, hours, numberOfParticipants, idUserPost, idUserAdmin, idNew) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        historyNew.date,
        historyNew.streetNumber,
        historyNew.address,
        historyNew.zipCode,
        historyNew.city,
        historyNew.hours,
        historyNew.numberOfParticipants,
        historyNew.idUserPost,
        historyNew.idUserAdmin,
        historyNew.idNew,
      ]
    );
  return results[0].insertId;
};

const updateHistoryNew = async (
  idHistoryNew: number,
  historyNew: IHistoryNew
): Promise<boolean> => {
  let sql = 'UPDATE historyNews SET ';
  const sqlValues: Array<string | number | boolean> = [];
  let oneValue = false;
  if (historyNew.date) {
    sql += 'date = ? ';
    sqlValues.push(historyNew.date);
    oneValue = true;
  }
  if (historyNew.streetNumber) {
    sql += oneValue ? ', streetNumber = ? ' : ' streetNumber = ? ';
    sqlValues.push(historyNew.streetNumber);
    oneValue = true;
  }
  if (historyNew.address) {
    sql += oneValue ? ', address = ? ' : ' address = ? ';
    sqlValues.push(historyNew.address);
    oneValue = true;
  }
  if (historyNew.zipCode) {
    sql += oneValue ? ', zipCode = ? ' : ' zipCode = ? ';
    sqlValues.push(historyNew.zipCode);
    oneValue = true;
  }
  if (historyNew.city) {
    sql += oneValue ? ', city = ? ' : ' city = ? ';
    sqlValues.push(historyNew.city);
    oneValue = true;
  }
  if (historyNew.hours) {
    sql += oneValue ? ', hours = ? ' : ' hours = ? ';
    sqlValues.push(historyNew.hours);
    oneValue = true;
  }
  if (historyNew.numberOfParticipants) {
    sql += oneValue
      ? ', numberOfParticipants = ? '
      : ' numberOfParticipants = ? ';
    sqlValues.push(historyNew.numberOfParticipants);
    oneValue = true;
  }
  if (historyNew.idUserPost) {
    sql += oneValue ? ', idUserPost = ? ' : ' idUserPost = ? ';
    sqlValues.push(historyNew.idUserPost);
    oneValue = true;
  }
  if (historyNew.idUserAdmin) {
    sql += oneValue ? ', idUserAdmin = ? ' : ' idUserAdmin = ? ';
    sqlValues.push(historyNew.idUserAdmin);
    oneValue = true;
  }
  if (historyNew.idNew) {
    sql += oneValue ? ', idNew = ? ' : ' idNew = ? ';
    sqlValues.push(historyNew.idNew);
    oneValue = true;
  }
  sql += ' WHERE id = ?';
  sqlValues.push(idHistoryNew);

  const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
  return results[0].affectedRows === 1;
};

const deleteHistoryNew = async (idHistoryNew: number): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM historyNews WHERE id = ?', [
      idHistoryNew,
    ]);
  return results[0].affectedRows === 1;
};

export {
  deleteHistoryNew,
  addHistoryNew,
  updateHistoryNew,
  getHistoryNewById,
  getAllHistoryNews,
};
