import { ResultSetHeader } from 'mysql2';
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

const addActivity = async (activity: IActivity): Promise<number> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO activities (name, category, shortName) VALUES (?, ?, ?)',
      [activity.name, activity.category, activity.shortName]
    );
  return results[0].insertId;
};

const updateActivity = async (
  idActivity: number,
  activity: IActivity
): Promise<boolean> => {
  let sql = 'UPDATE activities SET ';
  const sqlValues: Array<string | number | boolean> = [];
  let oneValue = false;
  if (activity.name) {
    sql += 'name = ? ';
    sqlValues.push(activity.name);
    oneValue = true;
  }
  if (activity.category) {
    sql += oneValue ? ', category = ? ' : ' category = ? ';
    sqlValues.push(activity.category);
    oneValue = true;
  }
  if (activity.shortName) {
    sql += oneValue ? ', shortName = ? ' : ' shortName = ? ';
    sqlValues.push(activity.shortName);
    oneValue = true;
  }
  sql += ' WHERE id = ?';
  sqlValues.push(idActivity);

  const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
  return results[0].affectedRows === 1;
};

const deleteActivity = async (idActivity: number): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM activities WHERE id = ?', [
      idActivity,
    ]);
  return results[0].affectedRows === 1;
};

export {
  getAllActivities,
  getActivityById,
  addActivity,
  updateActivity,
  deleteActivity,
};
