import connection from '../db-config';
import IHistoryPartner from '../interfaces/IHistoryPartner';
import { ResultSetHeader } from 'mysql2';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';

const nameIsFree = async (req: Request, res: Response, next: NextFunction) => {
  // Récupèrer le nom dans le req.body
  const historyPartner = req.body as IHistoryPartner;
  // Vérifier si le nom appartient déjà à un historyPartner
  const historyPartnerExists: IHistoryPartner = await getHistoryPartnerByName(
    historyPartner.name
  );
  // Si oui => erreur
  if (historyPartnerExists) {
    next(new ErrorHandler(409, `This historyPartner already exists`));
  } else {
    // Si non => next
    next();
  }
};

const siretNumberIsFree = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Récupèrer le téléphone dans le req.body
  const historyPartner = req.body as IHistoryPartner;
  // Vérifier si le téléphone appartient déjà à un historyPartner
  const historyPartnerExists: IHistoryPartner =
    await getHistoryPartnerBySiretNumber(historyPartner.siretNumber);
  // Si oui => erreur
  if (historyPartnerExists) {
    next(new ErrorHandler(409, `This historyPartner already exists`));
  } else {
    // Si non => next
    next();
  }
};

const getAllHistoryPartners = async (
  sortBy = ''
): Promise<IHistoryPartner[]> => {
  let sql = `SELECT id, name, logo, url, description, siretNumber, idType, idUserPost, idPartner FROM historyPartners`;
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }
  const results = await connection.promise().query<IHistoryPartner[]>(sql);
  return results[0];
};

const getHistoryPartnerById = async (
  idHistoryPartner: number
): Promise<IHistoryPartner> => {
  const [results] = await connection
    .promise()
    .query<IHistoryPartner[]>(
      'SELECT id, name, logo, url, description, siretNumber, idType, idUserPost, idPartner FROM historyPartners WHERE id = ?',
      [idHistoryPartner]
    );
  return results[0];
};

const getHistoryPartnerByName = async (
  nameHistoryPartner: string
): Promise<IHistoryPartner> => {
  const [results] = await connection
    .promise()
    .query<IHistoryPartner[]>(
      'SELECT id, name, logo, url, description, siretNumber, idType, idUserPost, idPartner FROM historyPartners WHERE name = ?',
      [nameHistoryPartner]
    );
  return results[0];
};

const getHistoryPartnerBySiretNumber = async (
  phoneNumber: number
): Promise<IHistoryPartner> => {
  const [results] = await connection
    .promise()
    .query<IHistoryPartner[]>(
      'SELECT id, name, logo, url, description, siretNumber, idType, idUserPost, idPartners  FROM historyPartners WHERE siretNumber = ?',
      [phoneNumber]
    );
  return results[0];
};

const addHistoryPartner = async (
  historyPartner: IHistoryPartner
): Promise<number> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO historyPartners (name, logo, url, description, siretNumber, idType, idUserPost, idPartner) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        historyPartner.name,
        historyPartner.logo,
        historyPartner.url,
        historyPartner.description,
        historyPartner.siretNumber,
        historyPartner.idHistoryPartnerType,
        historyPartner.idType,
        historyPartner.idUserPost,
        historyPartner.idPartner,
      ]
    );
  return results[0].insertId;
};

const updateHistoryPartner = async (
  idHistoryPartner: number,
  historyPartner: IHistoryPartner
): Promise<boolean> => {
  let sql = 'UPDATE historyPartners SET ';
  const sqlValues: Array<string | number | boolean> = [];
  let oneValue = false;

  if (historyPartner.name) {
    sql += 'name = ? ';
    sqlValues.push(historyPartner.name);
    oneValue = true;
  }
  if (historyPartner.logo) {
    sql += oneValue ? ', logo = ? ' : ' logo = ? ';
    sqlValues.push(historyPartner.logo);
    oneValue = true;
  }
  if (historyPartner.url) {
    sql += oneValue ? ', url = ? ' : ' url = ? ';
    sqlValues.push(historyPartner.url);
    oneValue = true;
  }
  if (historyPartner.description) {
    sql += oneValue ? ', description = ? ' : ' description = ? ';
    sqlValues.push(historyPartner.description);
    oneValue = true;
  }
  if (historyPartner.siretNumber) {
    sql += oneValue ? ', siretNumber = ? ' : ' siretNumber = ? ';
    sqlValues.push(historyPartner.siretNumber);
    oneValue = true;
  }
  if (historyPartner.idType) {
    sql += oneValue ? ', idType = ? ' : ' idType = ? ';
    sqlValues.push(historyPartner.idType);
    oneValue = true;
  }
  if (historyPartner.idUserPost) {
    sql += oneValue ? ', idUserPost = ? ' : ' idUserPost = ? ';
    sqlValues.push(historyPartner.idUserPost);
    oneValue = true;
  }
  if (historyPartner.idPartner) {
    sql += oneValue ? ', idPartner = ? ' : ' idPartner = ? ';
    sqlValues.push(historyPartner.idPartner);
    oneValue = true;
  }
  sql += ' WHERE id = ?';
  sqlValues.push(idHistoryPartner);

  const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
  return results[0].affectedRows === 1;
};

const deleteHistoryPartner = async (
  idHistoryPartner: number
): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM historyPartners WHERE id = ?', [
      idHistoryPartner,
    ]);
  return results[0].affectedRows === 1;
};

export {
  nameIsFree,
  getAllHistoryPartners,
  getHistoryPartnerByName,
  getHistoryPartnerById,
  getHistoryPartnerBySiretNumber,
  siretNumberIsFree,
  addHistoryPartner,
  updateHistoryPartner,
  deleteHistoryPartner,
};
