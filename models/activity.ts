import connection from '../db-config.js';
import IActivity from '../interfaces/IActivity';

const getAllActivities = async (sortBy = ''): Promise<IActivity[]> => {
  let sql = 'SELECT * FROM activities';
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }
  const results = await connection.promise().query<IActivity[]>(sql);
  return results[0];
};

const getActivityById = async (idActivity: number): Promise<IActivity> => {
  const [results] = await connection
    .promise()
    .query<IActivity[]>('SELECT * FROM activities WHERE id = ?', [idActivity]);
  return results[0];
};

export { getAllActivities, getActivityById };
