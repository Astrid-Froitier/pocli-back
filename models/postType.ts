import connection from '../db-config.js';
import IPostType from '../interfaces/IPostType';

const getAllPostType = async (sortBy = ''): Promise<IPostType[]> => {
    let sql = 'SELECT * FROM postTypes';
    if (sortBy) {
      sql += ` ORDER BY ${sortBy}`;
    }
    const results = await connection.promise().query<IPostType[]>(sql);
    return results[0];
  };

  const getPostTypeById = async (idPostType: number): Promise<IPostType> => {
    const [results] = await connection
      .promise()
      .query<IPostType[]>('SELECT * FROM postTypes WHERE id = ?', [idPostType]);
    return results[0];
  };

  const getPostTypeByName = async (idPostType: number): Promise<IPostType> => {
    const [results] = await connection
      .promise()
      .query<IPostType[]>('SELECT * FROM postTypes WHERE name = ?', [idPostType]);
    return results[0];
  };

  export {
    getAllPostType,
    getPostTypeById,
    getPostTypeByName,
  };