//import { Request, Response, NextFunction } from 'express';
import { ResultSetHeader } from 'mysql2';
import connection from '../db-config';
// import { ErrorHandler } from '../helpers/errors';
import IFamilyMember from '../interfaces/IFamilyMember';

// to have all of family members //
const getAllFamilyMembers = async (sortBy = ''): Promise<IFamilyMember[]> => {
  let sql = 'SELECT * FROM familyMembers';
  if (sortBy) {
    sql += `ORDER BY ${sortBy}`;
  }
  const results = await connection.promise().query<IFamilyMember[]>(sql);
  return results[0];
};

// to select one member by its id
const getFamilyMemberById = async (
  idFamilyMember: number
): Promise<IFamilyMember> => {
  const [results] = await connection
    .promise()
    .query<IFamilyMember[]>('SELECT * FROM familyMembers WHERE id =  ?', [
      idFamilyMember,
    ]);
  return results[0];
};

const getAllFamilyMembersByIdFamily = async (
  idFamily: number
): Promise<IFamilyMember[]> => {
  const [results] = await connection
    .promise()
    .query<IFamilyMember[]>('SELECT * FROM familyMembers WHERE idFamily =  ?', [
      idFamily,
    ]);
  return results;
};

const addFamilyMember = async (
  familyMember: IFamilyMember
): Promise<number> => {
  //   const hashedPassword = await hashPassword(familyMember.password);
  const results = await connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO familyMembers (idFamily, firstname, birthday, avatar ) VALUES (?, ?, ?, ?)',
      [
        familyMember.idFamily,
        familyMember.firstname,
        familyMember.birthday,
        familyMember.avatar,
      ]
    );
  return results[0].insertId;
};

const updateFamilyMember = async (
  idFamilyMember: number,
  familyMember: IFamilyMember
): Promise<boolean> => {
  let sql = 'UPDATE familyMembers SET ';
  const sqlValues: Array<string | number> = [];
  let oneValue = false;

  if (familyMember.idFamily) {
    sql += 'idFamily = ? ';
    sqlValues.push(familyMember.idFamily);
    oneValue = true;
  }
  if (familyMember.firstname) {
    sql += oneValue ? ', firstname = ? ' : ' firstname = ? ';
    sqlValues.push(familyMember.firstname);
    oneValue = true;
  }
  if (familyMember.birthday) {
    sql += oneValue ? ', birthday = ? ' : ' birthday = ? ';
    sqlValues.push(familyMember.birthday);
    oneValue = true;
  }
  if (familyMember.avatar) {
    sql += oneValue ? ', avatar = ? ' : ' avatar = ? ';
    sqlValues.push(familyMember.avatar);
    oneValue = true;
  }
  sql += ' WHERE id = ?';
  sqlValues.push(idFamilyMember);

  const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
  return results[0].affectedRows === 1;
};

const deleteFamilyMember = async (idFamilyMember: number): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM familyMembers WHERE id = ?', [
      idFamilyMember,
    ]);
  return results[0].affectedRows === 1;
};

export {
  getAllFamilyMembersByIdFamily,
  getAllFamilyMembers,
  getFamilyMemberById,
  addFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
};
