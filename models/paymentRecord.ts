import connection from '../db-config.js';
import { ResultSetHeader } from 'mysql2';
import IPaymentRecord from '../interfaces/IPaymentRecord';


const getAllPaymentRecord = async (sortBy = ''): Promise<IPaymentRecord[]> => {
    let sql = 'SELECT * FROM paymentRecords as pR INNER JOIN paymentMethods as pM WHERE pR.idPaymentMethod = pM.id INNER JOIN families as f WHERE pR.idFamily = f.id INNER JOIN familyMembers as fM WHERE pR.idFamilyMember = fM.id';
    if (sortBy) {
      sql += ` ORDER BY ${sortBy}`;
    }
    const results = await connection.promise().query<IPaymentRecord[]>(sql);
    return results[0];
  };

  const getPaymentRecordById = async (idPaymentRecord: number): Promise<IPaymentRecord> => {
    const [results] = await connection
      .promise()
      .query<IPaymentRecord[]>('SELECT * FROM paymentRecords as pR WHERE id = ? INNER JOIN paymentMethods as pM WHERE pR.idPaymentMethod = pM.id INNER JOIN families as f WHERE pR.idFamily = f.id INNER JOIN familyMembers as fM WHERE pR.idFamilyMember = fM.id ', [idPaymentRecord]);
    return results[0];
  };


  const addPaymentRecord = async (paymentRecord: IPaymentRecord): Promise<number> => {
    const results = await connection
      .promise()
      .query<ResultSetHeader>(
        'INSERT INTO paymentRecords (idPaymentMethod, numberCheck, isPaymentActivity, datePay, amountPay, idFamily, idFamilyMember) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [paymentRecord.numberCheck, paymentRecord.isPaymentActivity, paymentRecord.datePay, paymentRecord.amountPay, paymentRecord.idPaymentMethod, paymentRecord.idFamily, paymentRecord.idFamilyMember]
      );
    return results[0].insertId;
  };

  const updatePaymentRecord = async (idPaymentRecord: number, paymentRecord: IPaymentRecord): Promise<boolean> => {
    let sql = 'UPDATE paymentRecords SET ';
    const sqlValues: Array<string | number | boolean> = [];
    let oneValue = false;
  
    if (paymentRecord.numberCheck) {
      sql += 'numberCheck = ? ';
      sqlValues.push(paymentRecord.numberCheck);
      oneValue = true;
    }
    if (paymentRecord.isPaymentActivity) {
      sql += oneValue ? ', isPaymentActivity = ? ' : ' isPaymentActivity = ? ';
      sqlValues.push(paymentRecord.isPaymentActivity);
      oneValue = true;
    }
    if (paymentRecord.datePay) {
      sql += oneValue ? ', datePay = ? ' : ' datePay = ? ';
      sqlValues.push(paymentRecord.datePay);
      oneValue = true;
    }

    if (paymentRecord.amountPay) {
      sql += oneValue ? ', amountPay = ? ' : ' amountPay = ? ';
      sqlValues.push(paymentRecord.amountPay);
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
    
    sql += ' WHERE id = ?';
    sqlValues.push(idPaymentRecord);
  
    const results = await connection
      .promise()
      .query<ResultSetHeader>(sql, sqlValues);
    return results[0].affectedRows === 1;
  };

  const deletePaymentRecord = async (idPaymentRecord: number): Promise<boolean> => {
    const results = await connection
      .promise()
      .query<ResultSetHeader>('DELETE FROM paymentRecords WHERE id = ?', [idPaymentRecord]);
    return results[0].affectedRows === 1;
  };

  export {
    getAllPaymentRecord,
    getPaymentRecordById,
    addPaymentRecord,
    updatePaymentRecord,
    deletePaymentRecord
  };