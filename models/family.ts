import argon2, { Options } from 'argon2';
import { NextFunction, Request, Response } from 'express';
import { ResultSetHeader } from 'mysql2';
import connection from '../db-config';
import { ErrorHandler } from '../helpers/errors';
import IFamily from '../interfaces/IFamily';

const hashingOptions: Options & {
  raw?: false;
} = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

const hashPassword = (password: string): Promise<string> => {
  return argon2.hash(password, hashingOptions);
};
// password verification
const verifyPassword = (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return argon2.verify(hashedPassword, password, hashingOptions);
};

// to see if the email is available
const emailIsFree = async (req: Request, res: Response, next: NextFunction) => {
  // get email form req.body
  const family = req.body as IFamily;
  //
  const familyExists: IFamily = await getFamilyByEmail(family.email);
  if (familyExists) {
    next(new ErrorHandler(409, `This family already exists`));
  } else {
    next();
  }
};

// return all families
const getAllFamilies = async (sortBy = ''): Promise<IFamily[]> => {
  let sql =
    'SELECT id, name, streetNumber, adress, phoneNumber, email, password, idCity, idRecipient, isActive FROM families';
  if (sortBy) {
    sql += `ORDER BY ${sortBy}`;
  }
  const results = await connection.promise().query<IFamily[]>(sql);
  return results[0];
};

// select family by its id
const getFamilyById = async (idFamily: number): Promise<IFamily> => {
  const [results] = await connection
    .promise()
    .query<IFamily[]>('SELECT id, name, email FROM families WHERE id = ?', [
      idFamily,
    ]);
  return results[0];
};

const getFamilyByEmail = async (email: string): Promise<IFamily> => {
  const [results] = await connection
    .promise()
    .query<IFamily[]>('SELECT id, name FROM families WHERE email = ?', [email]);
  return results[0];
};

const addFamily = async (family: IFamily): Promise<number> => {
  const hashedPassword = await hashPassword(family.password);
  const results = await connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO families (name, streetNumber, address, phoneNumber, email, password, idCity, idRecipient, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        family.name,
        family.streetnumber,
        family.address,
        family.phoneNumber,
        family.email,
        hashedPassword,
        family.idCity,
        family.idRecipient,
        family.isActive,
      ]
    );
  return results[0].insertId;
};

const updateFamily = async (
  idFamily: number,
  family: IFamily
): Promise<boolean> => {
  let sql = 'UPDATE family SET';
  const sqlValues: Array<string | number | boolean> = [];
  let oneValue = false;

  if (family.name) {
    sql += 'name = ? ';
    sqlValues.push(family.name);
    oneValue = true;
  }
  if (family.streetNumber) {
    sql += oneValue ? ', streetNumber = ? ' : 'streetNumber = ? ';
    sqlValues.push(family.streetNumber);
    oneValue = true;
  }
  if (family.address) {
    sql += oneValue ? ', address = ? ' : ' address = ? ';
    sqlValues.push(family.address);
    oneValue = true;
  }
  if (family.phoneNumber) {
    sql += oneValue ? ', phoneNumber = ? ' : ' phoneNumber = ? ';
    sqlValues.push(family.phoneNumber);
    oneValue = true;
  }
  if (family.email) {
    sql += oneValue ? ', email = ? ' : ' email = ? ';
    sqlValues.push(family.email);
    oneValue = true;
  }
  if (family.password) {
    sql += oneValue ? ', password = ? ' : ' password = ? ';
    const hashedPassword: string = await hashPassword(family.password);
    sqlValues.push(hashedPassword);
    oneValue = true;
  }
  if (family.idCity) {
    sql += oneValue ? ', idCity = ? ' : ' idCity = ? ';
    sqlValues.push(family.idCity);
    oneValue = true;
  }
  if (family.idRecipient) {
    sql += oneValue ? ', idRecipient = ?' : ' idRecipient = ? ';
    sqlValues.push(family.idRecipient);
    oneValue = true;
  }
  if (family.isActive) {
    sql += oneValue ? ', isActive = ?' : ' isActive = ?';
    sqlValues.push(family.isActive);
    oneValue = true;
  }
  sql += ' WHERE id = ?';
  sqlValues.push(idFamily);

  const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
  return results[0].affectedRows === 1;
};

const deleteFamily = async (idFamily: number): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM families WHERE id = ?', [idFamily]);
  return results[0].affectedRows === 1;
};

export {
  verifyPassword,
  getAllFamilies,
  getFamilyById,
  emailIsFree,
  getFamilyByEmail,
  addFamily,
  updateFamily,
  deleteFamily,
};
