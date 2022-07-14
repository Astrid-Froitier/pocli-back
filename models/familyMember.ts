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
      'INSERT INTO familyMembers (idFamily, firstname, birthday, isActive, avatar ) VALUES (?, ?, ?, ?, ?)',
      [
        familyMember.idFamily,
        familyMember.firstname,
        familyMember.birthday,
        familyMember.isActive,
        familyMember.avatar,
      ]
    );
  return results[0].insertId;
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
  getFamilyMembersByIdFamily,
  addFamilyMember,
  deleteFamilyMember,
};
