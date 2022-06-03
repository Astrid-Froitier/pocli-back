import connection from '../db-config';
import IPartner from '../interfaces/IPartner';
import { ResultSetHeader } from 'mysql2';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';

const nameIsFree = async (req: Request, res: Response, next: NextFunction) => {
  // Récupèrer le nom dans le req.body
  const partner = req.body as IPartner;
  // Vérifier si le nom appartient déjà à un partner
  const partnerExists: IPartner = await getPartnerByName(partner.name);
  // Si oui => erreur
  if (partnerExists) {
    next(new ErrorHandler(409, `This partner already exists`));
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
  const partner = req.body as IPartner;
  // Vérifier si le téléphone appartient déjà à un partner
  const partnerExists: IPartner = await getPartnerBySiretNumber(
    partner.siretNumber
  );
  // Si oui => erreur
  if (partnerExists) {
    next(new ErrorHandler(409, `This partner already exists`));
  } else {
    // Si non => next
    next();
  }
};

const getAllPartners = async (sortBy = ''): Promise<IPartner[]> => {
  let sql = `SELECT id, name, logo, url, description, siretNumber, idPartnerType, idUser FROM partners`;
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }
  const results = await connection.promise().query<IPartner[]>(sql);
  return results[0];
};

const getPartnerById = async (idPartner: number): Promise<IPartner> => {
  const [results] = await connection
    .promise()
    .query<IPartner[]>(
      'SELECT id, name, logo, url, description, siretNumber, idPartnerType, idUser FROM partners WHERE id = ?',
      [idPartner]
    );
  return results[0];
};

const getPartnerByName = async (namePartner: string): Promise<IPartner> => {
  const [results] = await connection
    .promise()
    .query<IPartner[]>(
      'SELECT id, name, logo, url, description, siretNumber, idPartnerType, idUser FROM partners WHERE name = ?',
      [namePartner]
    );
  return results[0];
};

const getPartnerBySiretNumber = async (
  phoneNumber: number
): Promise<IPartner> => {
  const [results] = await connection
    .promise()
    .query<IPartner[]>(
      'SELECT id, name, logo, url, description, siretNumber, idPartnerType, idUser  FROM partners WHERE siretNumber = ?',
      [phoneNumber]
    );
  return results[0];
};

const addPartner = async (partner: IPartner): Promise<number> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO partners (name, logo, url, description, siretNumber, idPartnerType, idUser) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        partner.name,
        partner.logo,
        partner.url,
        partner.description,
        partner.siretNumber,
        partner.idPartnerType,
        partner.idUser,
      ]
    );
  return results[0].insertId;
};

const updatePartner = async (
  idPartner: number,
  partner: IPartner
): Promise<boolean> => {
  let sql = 'UPDATE partners SET ';
  const sqlValues: Array<string | number | boolean> = [];
  let oneValue = false;

  if (partner.name) {
    sql += 'name = ? ';
    sqlValues.push(partner.name);
    oneValue = true;
  }
  if (partner.logo) {
    sql += oneValue ? ', logo = ? ' : ' logo = ? ';
    sqlValues.push(partner.logo);
    oneValue = true;
  }
  if (partner.url) {
    sql += oneValue ? ', url = ? ' : ' url = ? ';
    sqlValues.push(partner.url);
    oneValue = true;
  }
  if (partner.description) {
    sql += oneValue ? ', description = ? ' : ' description = ? ';
    sqlValues.push(partner.description);
    oneValue = true;
  }
  if (partner.siretNumber) {
    sql += oneValue ? ', siretNumber = ? ' : ' siretNumber = ? ';
    sqlValues.push(partner.siretNumber);
    oneValue = true;
  }
  if (partner.idPartnerType) {
    sql += oneValue ? ', idPartnerType = ? ' : ' idPartnerType = ? ';
    sqlValues.push(partner.idPartnerType);
    oneValue = true;
  }
  if (partner.idUser) {
    sql += oneValue ? ', idUser = ? ' : ' idUser = ? ';
    sqlValues.push(partner.idUser);
    oneValue = true;
  }
  sql += ' WHERE id = ?';
  sqlValues.push(idPartner);

  const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
  return results[0].affectedRows === 1;
};

const deletePartner = async (idPartner: number): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM partners WHERE id = ?', [idPartner]);
  return results[0].affectedRows === 1;
};

export {
  nameIsFree,
  getAllPartners,
  getPartnerByName,
  getPartnerById,
  getPartnerBySiretNumber,
  siretNumberIsFree,
  addPartner,
  updatePartner,
  deletePartner,
};
