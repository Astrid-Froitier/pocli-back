import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import IPaymentRecord from '../interfaces/IPaymentRecord';

const getAllPaymentRecord = async (sortBy = ''): Promise<IPaymentRecord[]> => {
  let sql = 'SELECT * FROM paymentRecords';
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }
  const results = await connection.promise().query<IPaymentRecord[]>(sql);
  return results[0];
};

const getPaymentRecordById = async (
  idPaymentRecord: number
): Promise<IPaymentRecord> => {
  const [results] = await connection
    .promise()
    .query<IPaymentRecord[]>('SELECT * FROM paymentRecords WHERE id = ?', [
      idPaymentRecord,
    ]);
  return results[0];
};

const getAllPaymentRecordsByIdFamily = async (
  idFamily: number
): Promise<IPaymentRecord[]> => {
  const [results] = await connection
    .promise()
    .query<IPaymentRecord[]>(
      'SELECT * FROM paymentRecords WHERE idFamily = ?',
      [idFamily]
    );
  return results;
};

const addPaymentRecord = async (
  paymentRecord: IPaymentRecord
): Promise<number> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO paymentRecords (idPaymentMethod, checkNumber, dateStart, dateEnd, amount, idFamily, idFamilyMember, idActivity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        paymentRecord.checkNumber,
        paymentRecord.dateStart,
        paymentRecord.dateEnd,
        paymentRecord.amount,
        paymentRecord.idPaymentMethod,
        paymentRecord.idFamily,
        paymentRecord.idFamilyMember,
        paymentRecord.idActivity,
      ]
    );
  return results[0].insertId;
};

const updatePaymentRecord = async (
  idPaymentRecord: number,
  paymentRecord: IPaymentRecord
): Promise<boolean> => {
  let sql = 'UPDATE paymentRecords SET ';
  const sqlValues: Array<string | number | boolean> = [];
  let oneValue = false;

  if (paymentRecord.checkNumber) {
    sql += 'checkNumber = ? ';
    sqlValues.push(paymentRecord.checkNumber);
    oneValue = true;
  }
  if (paymentRecord.dateStart) {
    sql += oneValue ? ', dateStart = ? ' : ' dateStart = ? ';
    sqlValues.push(paymentRecord.dateStart);
    oneValue = true;
  }
  if (paymentRecord.dateEnd) {
    sql += oneValue ? ', dateEnd = ? ' : ' dateEnd = ? ';
    sqlValues.push(paymentRecord.dateEnd);
    oneValue = true;
  }

  if (paymentRecord.amount) {
    sql += oneValue ? ', amount = ? ' : ' amount = ? ';
    sqlValues.push(paymentRecord.amount);
    oneValue = true;
  }
  if (paymentRecord.idPaymentMethod) {
    sql += oneValue ? ', idPaymentMethod = ? ' : ' idPaymentMethod = ? ';
    sqlValues.push(paymentRecord.idPaymentMethod);
    oneValue = true;
  }
  if (paymentRecord.idFamily) {
    sql += oneValue ? ', idFamily = ? ' : ' idFamily = ? ';
    sqlValues.push(paymentRecord.idFamily);
    oneValue = true;
  }
  if (paymentRecord.idFamilyMember) {
    sql += oneValue ? ', idFamilyMember = ? ' : ' idFamilyMember = ? ';
    sqlValues.push(paymentRecord.idFamilyMember);
    oneValue = true;
  }
  if (paymentRecord.idActivity) {
    sql += oneValue ? ', idActivity = ? ' : ' idActivity = ? ';
    sqlValues.push(paymentRecord.idActivity);
    oneValue = true;
  }

  sql += ' WHERE id = ?';
  sqlValues.push(idPaymentRecord);

  const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
  return results[0].affectedRows === 1;
};

const deletePaymentRecord = async (
  idPaymentRecord: number
): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM paymentRecords WHERE id = ?', [
      idPaymentRecord,
    ]);
  return results[0].affectedRows === 1;
};

export {
  getAllPaymentRecordsByIdFamily,
  getAllPaymentRecord,
  getPaymentRecordById,
  addPaymentRecord,
  updatePaymentRecord,
  deletePaymentRecord,
};
