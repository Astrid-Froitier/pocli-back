import connection from '../db-config';
import INewsType from '../interfaces/INewsType';
import { ResultSetHeader } from 'mysql2';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';

const nameIsFree = async (req: Request, res: Response, next: NextFunction) => {
  // Récupèrer le nom dans le req.body
  const newsType = req.body as INewsType;
  // Vérifier si le nom appartient déjà à un partner
  const newsTypeExists: INewsType = await getNewsTypeByName(newsType.name);
  // Si oui => erreur
  if (newsTypeExists) {
    next(new ErrorHandler(409, `This newsType already exists`));
  } else {
    // Si non => next
    next();
  }
};

const getAllNewsTypes = async (sortBy = ''): Promise<INewsType[]> => {
  let sql = `SELECT id, name FROM newsTypes`;
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }
  const results = await connection.promise().query<INewsType[]>(sql);
  return results[0];
};

const getNewsTypeById = async (idNewsType: number): Promise<INewsType> => {
  const [results] = await connection
    .promise()
    .query<INewsType[]>('SELECT id, name FROM newsTypes WHERE id = ?', [
      idNewsType,
    ]);
  return results[0];
};

const getNewsTypeByName = async (nameNewsType: string): Promise<INewsType> => {
  const [results] = await connection
    .promise()
    .query<INewsType[]>('SELECT id, name FROM newsTypes WHERE name = ?', [
      nameNewsType,
    ]);
  return results[0];
};

const addNewsType = async (newsType: INewsType): Promise<number> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO newsTypes name VALUES ?', [
      newsType.name,
    ]);
  return results[0].insertId;
};

const updateNewsType = async (
  idNewsType: number,
  newsType: INewsType
): Promise<boolean> => {
  let sql = 'UPDATE newsType SET ';
  const sqlValues: Array<string | number | boolean> = [];
  if (newsType.name) {
    sql += 'name = ? ';
    sqlValues.push(newsType.name);
  }
  sql += ' WHERE id = ?';
  sqlValues.push(idNewsType);

  const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
  return results[0].affectedRows === 1;
};

const deleteNewsType = async (idNewsType: number): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM newsTypes WHERE id = ?', [idNewsType]);
  return results[0].affectedRows === 1;
};

export {
  nameIsFree,
  getAllNewsTypes,
  getNewsTypeByName,
  getNewsTypeById,
  addNewsType,
  updateNewsType,
  deleteNewsType,
};
