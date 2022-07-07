//import { Request, Response, NextFunction } from 'express';
import { ResultSetHeader } from 'mysql2';
import connection from '../db-config';
// import { ErrorHandler } from '../helpers/errors';
import IFamilyMember from '../interfaces/IFamilyMember';

// to see if the email is available
// const emailIsFree = async (req: Request, res: Response, next: NextFunction) => {
//   const familyMember = req.body as IFamilyMember;
//   const familyMemberExists: IFamilyMember = await getFamilyMemberByEmail(
//     familyMember.email
//   );
//   if (familyMemberExists) {
//     next(new ErrorHandler(409, `This email's member already exists`));
//   } else {
//     next();
//   }
// };

// to have all of family members //
const getAllFamilyMembers = async (sortBy = ''): Promise<IFamilyMember[]> => {
  let sql =
    'SELECT id, idFamily, firstname, birthday, isActive FROM familyMembers';
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
    .query<IFamilyMember[]>(
      'SELECT id, firstname, birthday FROM familyMembers WHERE id =  ?',
      [idFamilyMember]
    );
  return results[0];
};

const addFamilyMember = async (
  familyMember: IFamilyMember
): Promise<number> => {
  //   const hashedPassword = await hashPassword(familyMember.password);
  const results = await connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO familyMembers (idFamily, firstname, birthday, isActive) VALUES (?, ?, ?, ?)',
      [
        familyMember.idFamily,
        familyMember.firstname,
        familyMember.birthday,
        familyMember.isActive,
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
  getAllFamilyMembers,
  getFamilyMemberById,
  addFamilyMember,
  deleteFamilyMember,
};
