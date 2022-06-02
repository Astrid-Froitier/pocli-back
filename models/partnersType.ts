import connection from '../db-config';
import IPartnersType from '../interfaces/IPartnersType';
import { ResultSetHeader } from 'mysql2';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';

const nameIsFree = async (req: Request, res: Response, next: NextFunction) => {
  // Récupèrer le nom dans le req.body
  const partnersType = req.body as IPartnersType;
  // Vérifier si le nom appartient déjà à un partner
  const partnersTypeExists: IPartnersType = await getPartnersTypeByName(
    partnersType.name
  );
  // Si oui => erreur
  if (partnersTypeExists) {
    next(new ErrorHandler(409, `This partnersType already exists`));
  } else {
    // Si non => next
    next();
  }
};

const getAllPartnersTypes = async (sortBy = ''): Promise<IPartnersType[]> => {
  let sql = `SELECT id, name FROM partnersTypes`;
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }
  const results = await connection.promise().query<IPartnersType[]>(sql);
  return results[0];
};

const getPartnersTypeById = async (
  idPartnersType: number
): Promise<IPartnersType> => {
  const [results] = await connection
    .promise()
    .query<IPartnersType[]>('SELECT id, name FROM partnersTypes WHERE id = ?', [
      idPartnersType,
    ]);
  return results[0];
};

const getPartnersTypeByName = async (
  namePartnersType: string
): Promise<IPartnersType> => {
  const [results] = await connection
    .promise()
    .query<IPartnersType[]>('SELECT id, name WHERE name = ?', [
      namePartnersType,
    ]);
  return results[0];
};

const addPartnersType = async (partner: IPartnersType): Promise<number> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('INSERT INTO partnersTypes name VALUES ?', [
      partner.name,
    ]);
  return results[0].insertId;
};

const updatePartnersType = async (
  idPartnersType: number,
  partnersType: IPartnersType
): Promise<boolean> => {
  let sql = 'UPDATE partners SET ';
  const sqlValues: Array<string | number | boolean> = [];
  let oneValue = false;
  if (partnersType.name) {
    sql += 'name = ? ';
    sqlValues.push(partnersType.name);
    oneValue = true;
  }
  sql += ' WHERE id = ?';
  sqlValues.push(idPartnersType);

  const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
  return results[0].affectedRows === 1;
};

const deletePartnersType = async (idPartnersType: number): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM partners WHERE id = ?', [
      idPartnersType,
    ]);
  return results[0].affectedRows === 1;
};

export {
  nameIsFree,
  getAllPartnersTypes,
  getPartnersTypeByName,
  getPartnersTypeById,
  addPartnersType,
  updatePartnersType,
  deletePartnersType,
};
