import connection from '../db-config';
import IAdmin from '../interfaces/IAdmin';
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
  const admin = req.body as IAdmin;
  // Vérifier si l'email appartient déjà à un admin
  const adminExists: IAdmin = await getAdminByEmail(admin.email);
  // Si oui => erreur
  if (adminExists) {
    next(new ErrorHandler(409, `This admin already exists`));
  } else {
    // Si non => next
    next();
  }
};

const getAllAdmins = async (sortBy = ''): Promise<IAdmin[]> => {
  let sql = `SELECT id, firstname, lastname, email FROM admins`;
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }
  const results = await connection.promise().query<IAdmin[]>(sql);
  return results[0];
};

const getAdminById = async (idAdmin: number): Promise<IAdmin> => {
  const [results] = await connection
    .promise()
    .query<IAdmin[]>(
      'SELECT id, firstname, lastname, email FROM admins WHERE id = ?',
      [idAdmin]
    );
  return results[0];
};

const getAdminByEmail = async (email: string): Promise<IAdmin> => {
  const [results] = await connection
    .promise()
    .query<IAdmin[]>(
      'SELECT id, email, password, firstname FROM admins WHERE email = ?',
      [email]
    );
  return results[0];
};

const addAdmin = async (admin: IAdmin): Promise<number> => {
  const hashedPassword = await hashPassword(admin.password);
  const results = await connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO admins (firstname, lastname, email, password) VALUES (?, ?, ?, ?)',
      [admin.firstname, admin.lastname, admin.email, hashedPassword]
    );
  return results[0].insertId;
};

const updateAdmin = async (
  idAdmin: number,
  admin: IAdmin
): Promise<boolean> => {
  let sql = 'UPDATE admins SET ';
  const sqlValues: Array<string | number | boolean> = [];
  let oneValue = false;

  if (admin.firstname) {
    sql += 'firstname = ? ';
    sqlValues.push(admin.firstname);
    oneValue = true;
  }
  if (admin.lastname) {
    sql += oneValue ? ', lastname = ? ' : ' lastname = ? ';
    sqlValues.push(admin.lastname);
    oneValue = true;
  }
  if (admin.email) {
    sql += oneValue ? ', email = ? ' : ' email = ? ';
    sqlValues.push(admin.email);
    oneValue = true;
  }
  if (admin.password) {
    sql += oneValue ? ', password = ? ' : ' password = ? ';
    const hashedPassword: string = await hashPassword(admin.password);
    sqlValues.push(hashedPassword);
    oneValue = true;
  }
  sql += ' WHERE id = ?';
  sqlValues.push(idAdmin);

  const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
  return results[0].affectedRows === 1;
};

const deleteAdmin = async (idAdmin: number): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM admins WHERE id = ?', [idAdmin]);
  return results[0].affectedRows === 1;
};

export {
  verifyPassword,
  getAllAdmins,
  addAdmin,
  getAdminByEmail,
  getAdminById,
  deleteAdmin,
  updateAdmin,
  emailIsFree,
};
