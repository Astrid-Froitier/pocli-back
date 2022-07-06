import connection from '../db-config.js';
// import { ResultSetHeader } from 'mysql2';
import IPaymentMethod from '../interfaces/IPaymentMethod';

const getAllPaymentMethods = async (sortBy = ''): Promise<IPaymentMethod[]> => {
    let sql = 'SELECT * FROM paymentMethods';
    if (sortBy) {
      sql += ` ORDER BY ${sortBy}`;
    }
    const results = await connection.promise().query<IPaymentMethod[]>(sql);
    return results[0];
  };

  const getPaymentMethodById = async (idPaymentMethod: number): Promise<IPaymentMethod> => {
    const [results] = await connection
      .promise()
      .query<IPaymentMethod[]>('SELECT * FROM paymentMethods WHERE id = ?', [idPaymentMethod]);
    return results[0];
  };

  const getPaymentMethodByName = async (idPaymentMethod: number): Promise<IPaymentMethod> => {
    const [results] = await connection
      .promise()
      .query<IPaymentMethod[]>('SELECT * FROM paymentMethods WHERE name = ?', [idPaymentMethod]);
    return results[0];
  };

  export {
    getAllPaymentMethods,
    getPaymentMethodById,
    getPaymentMethodByName,
  };