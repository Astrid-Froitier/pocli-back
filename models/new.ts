import connection from '../db-config';
import INew from '../interfaces/INew';
import { ResultSetHeader } from 'mysql2';

const getAllNews = async (sortBy = ''): Promise<INew[]> => {
  let sql = `SELECT id, date, streetNumber, address, zipCode, city, hours, numberOfParticipants, idUser, idNewsType FROM news`;
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }
  const results = await connection.promise().query<INew[]>(sql);
  return results[0];
};

const getNewById = async (idNew: number): Promise<INew> => {
  const [results] = await connection
    .promise()
    .query<INew[]>(
      'SELECT id, date, streetNumber, address, zipCode, city, hours, numberOfParticipants, idUser, idNewsType FROM news WHERE id = ?',
      [idNew]
    );
  return results[0];
};

const addNew = async (New: INew): Promise<number> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO news (date, streetNumber, address, zipCode, city, hours, numberOfParticipants, idUser, idNewsType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        New.date,
        New.streetNumber,
        New.address,
        New.zipCode,
        New.city,
        New.hours,
        New.numberOfParticipants,
        New.idUser,
        New.idNewsType,
      ]
    );
  return results[0].insertId;
};

const updateNew = async (idNew: number, New: INew): Promise<boolean> => {
  let sql = 'UPDATE news SET ';
  const sqlValues: Array<string | number | boolean> = [];
  let oneValue = false;
  if (New.date) {
    sql += 'date = ? ';
    sqlValues.push(New.date);
    oneValue = true;
  }
  if (New.streetNumber) {
    sql += oneValue ? ', streetNumber = ? ' : ' streetNumber = ? ';
    sqlValues.push(New.streetNumber);
    oneValue = true;
  }
  if (New.address) {
    sql += oneValue ? ', address = ? ' : ' address = ? ';
    sqlValues.push(New.address);
    oneValue = true;
  }
  if (New.zipCode) {
    sql += oneValue ? ', zipCode = ? ' : ' zipCode = ? ';
    sqlValues.push(New.zipCode);
    oneValue = true;
  }
  if (New.city) {
    sql += oneValue ? ', city = ? ' : ' city = ? ';
    sqlValues.push(New.city);
    oneValue = true;
  }
  if (New.hours) {
    sql += oneValue ? ', hours = ? ' : ' hours = ? ';
    sqlValues.push(New.hours);
    oneValue = true;
  }
  if (New.numberOfParticipants) {
    sql += oneValue
      ? ', numberOfParticipants = ? '
      : ' numberOfParticipants = ? ';
    sqlValues.push(New.numberOfParticipants);
    oneValue = true;
  }
  if (New.idUser) {
    sql += oneValue ? ', idUser = ? ' : ' idUser = ? ';
    sqlValues.push(New.idUser);
    oneValue = true;
  }
  if (New.idNewsType) {
    sql += oneValue ? ', idNewsType = ? ' : ' idNewsType = ? ';
    sqlValues.push(New.idNewsType);
    oneValue = true;
  }
  sql += ' WHERE id = ?';
  sqlValues.push(idNew);

  const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
  return results[0].affectedRows === 1;
};

const deleteNew = async (idNew: number): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM news WHERE id = ?', [idNew]);
  return results[0].affectedRows === 1;
};

export { deleteNew, addNew, updateNew, getNewById, getAllNews };
