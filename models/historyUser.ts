import connection from '../db-config';
import IHistoryUser from '../interfaces/IHistoryUser';
import argon2, { Options } from 'argon2';
import { ResultSetHeader } from 'mysql2';
import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../helpers/errors';

const hashingOptions: Options & { raw?: false } = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

const hashPassword = (password: string): Promise<string> => {
  return argon2.hash(password, hashingOptions);
};

const verifyPassword = (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return argon2.verify(hashedPassword, password, hashingOptions);
};

const emailIsFree = async (req: Request, res: Response, next: NextFunction) => {
  // Récupèrer l'email dans le req.body
  const historyUser = req.body as IHistoryUser;
  // Vérifier si l'email appartient déjà à un historyUser
  const historyUserExists: IHistoryUser = await getHistoryUserByEmail(
    historyUser.email
  );
  // Si oui => erreur
  if (historyUserExists) {
    next(new ErrorHandler(409, `This historyUser already exists`));
  } else {
    // Si non => next
    next();
  }
};

const phoneNumberIsFree = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Récupèrer le téléphone dans le req.body
  const historyUser = req.body as IHistoryUser;
  // Vérifier si le téléphone appartient déjà à unh istoryUser
  const historyUserExists: IHistoryUser = await getHistoryUserByPhoneNumber(
    historyUser.phoneNumber
  );
  // Si oui => erreur
  if (historyUserExists) {
    next(new ErrorHandler(409, `This historyUser already exists`));
  } else {
    // Si non => next
    next();
  }
};

const getAllHistoryUsers = async (sortBy = ''): Promise<IHistoryUser[]> => {
  let sql = `SELECT id, firstname, lastname, email, password, streetNumber, address, zipCode, city, phoneNumber, isAdmin, isIntervenant, isAdherent, idUserPost, idUserAdmin FROM historyUsers`;
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }
  const results = await connection.promise().query<IHistoryUser[]>(sql);
  return results[0];
};

const getHistoryUserById = async (
  idHistoryUser: number
): Promise<IHistoryUser> => {
  const [results] = await connection
    .promise()
    .query<IHistoryUser[]>(
      'SELECT id, firstname, lastname, email, password, streetNumber, address, zipCode, city, phoneNumber, isAdmin, isIntervenant, isAdherent FROM historyUsers WHERE id = ?',
      [idHistoryUser]
    );
  return results[0];
};

const getHistoryUserByPhoneNumber = async (
  phoneNumber: number
): Promise<IHistoryUser> => {
  const [results] = await connection
    .promise()
    .query<IHistoryUser[]>(
      'SELECT id, firstname, lastname, email, password, streetNumber, address, zipCode, city, phoneNumber, isAdmin, isIntervenant, isAdherent, idUserPost, idUserAdmin FROM historyUsers WHERE phoneNumber = ?',
      [phoneNumber]
    );
  return results[0];
};

const getHistoryUserByEmail = async (email: string): Promise<IHistoryUser> => {
  const [results] = await connection
    .promise()
    .query<IHistoryUser[]>(
      'SELECT id, firstname, lastname, email, password, streetNumber, address, zipCode, city, phoneNumber, isAdmin, isIntervenant, isAdherent, idUserPost, idUserAdmin FROM historyUsers WHERE email = ?',
      [email]
    );
  return results[0];
};

const addHistoryUser = async (historyUser: IHistoryUser): Promise<number> => {
  const hashedPassword = await hashPassword(historyUser.password);
  const results = await connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO historyUsers (firstname, lastname, email, password, streetNumber, address, zipCode, city, phoneNumber, isAdmin, isIntervenant, isAdherent, idUserPost, idUserAdmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        historyUser.firstname,
        historyUser.lastname,
        historyUser.email,
        hashedPassword,
        historyUser.streetNumber,
        historyUser.address,
        historyUser.zipCode,
        historyUser.city,
        historyUser.phoneNumber,
        historyUser.isAdmin,
        historyUser.isIntervenant,
        historyUser.isAdherent,
        historyUser.idUserPost,
        historyUser.idUserAdmin,
      ]
    );
  return results[0].insertId;
};

const updateHistoryUser = async (
  idHistoryUser: number,
  historyUser: IHistoryUser
): Promise<boolean> => {
  let sql = 'UPDATE historyUsers SET ';
  const sqlValues: Array<string | number | boolean> = [];
  let oneValue = false;

  if (historyUser.firstname) {
    sql += 'firstname = ? ';
    sqlValues.push(historyUser.firstname);
    oneValue = true;
  }
  if (historyUser.lastname) {
    sql += oneValue ? ', lastname = ? ' : ' lastname = ? ';
    sqlValues.push(historyUser.lastname);
    oneValue = true;
  }
  if (historyUser.email) {
    sql += oneValue ? ', email = ? ' : ' email = ? ';
    sqlValues.push(historyUser.email);
    oneValue = true;
  }
  if (historyUser.password) {
    sql += oneValue ? ', password = ? ' : ' password = ? ';
    const hashedPassword: string = await hashPassword(historyUser.password);
    sqlValues.push(hashedPassword);
    oneValue = true;
  }
  if (historyUser.streetNumber) {
    sql += oneValue ? ', streetNumber = ? ' : ' streetNumber = ? ';
    sqlValues.push(historyUser.streetNumber);
    oneValue = true;
  }
  if (historyUser.address) {
    sql += oneValue ? ', address = ? ' : ' address = ? ';
    sqlValues.push(historyUser.address);
    oneValue = true;
  }
  if (historyUser.zipCode) {
    sql += oneValue ? ', zipCode = ? ' : ' zipCode = ? ';
    sqlValues.push(historyUser.zipCode);
    oneValue = true;
  }
  if (historyUser.city) {
    sql += oneValue ? ', city = ? ' : ' city = ? ';
    sqlValues.push(historyUser.city);
    oneValue = true;
  }
  if (historyUser.phoneNumber) {
    sql += oneValue ? ', phoneNumber = ? ' : ' phoneNumber = ? ';
    sqlValues.push(historyUser.phoneNumber);
    oneValue = true;
  }
  if (historyUser.isAdmin) {
    sql += oneValue ? ', isAdmin = ? ' : ' isAdmin = ? ';
    sqlValues.push(historyUser.isAdmin);
    oneValue = true;
  }
  if (historyUser.isIntervenant) {
    sql += oneValue ? ', isIntervenant = ? ' : ' isIntervenant = ? ';
    sqlValues.push(historyUser.isIntervenant);
    oneValue = true;
  }
  if (historyUser.isAdherent) {
    sql += oneValue ? ', isAdherent = ? ' : ' isAdherent = ? ';
    sqlValues.push(historyUser.isAdherent);
    oneValue = true;
  }
  sql += ' WHERE id = ?';
  sqlValues.push(idHistoryUser);

  const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
  return results[0].affectedRows === 1;
};

const deleteHistoryUser = async (idHistoryUser: number): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM historyUsers WHERE id = ?', [
      idHistoryUser,
    ]);
  return results[0].affectedRows === 1;
};

export {
  verifyPassword,
  phoneNumberIsFree,
  getAllHistoryUsers,
  addHistoryUser,
  getHistoryUserByEmail,
  getHistoryUserByPhoneNumber,
  getHistoryUserById,
  deleteHistoryUser,
  updateHistoryUser,
  emailIsFree,
};
