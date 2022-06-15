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

  export {
    getAllPartners,
    getPartnerById,
    getPartnerByName,
  };