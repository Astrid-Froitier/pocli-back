import connection from '../db-config.js';
import ICommunicationMember from '../interfaces/ICommunicationMember';

const getAllCommunicationMembers = async (
  sortBy = ''
): Promise<ICommunicationMember[]> => {
  let sql = 'SELECT * FROM communicationMembers';
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }
  const results = await connection.promise().query<ICommunicationMember[]>(sql);
  return results[0];
};

const getCommunicationMemberById = async (
  idCommunicationMember: number
): Promise<ICommunicationMember> => {
  const [results] = await connection
    .promise()
    .query<ICommunicationMember[]>(
      'SELECT * FROM communicationMembers WHERE id = ?',
      [idCommunicationMember]
    );
  return results[0];
};

export { getAllCommunicationMembers, getCommunicationMemberById };
