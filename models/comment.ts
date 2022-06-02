import connection from '../db-config';
import IComment from '../interfaces/IComment';
import { ResultSetHeader } from 'mysql2';

const getAllComments = async (sortBy = ''): Promise<IComment[]> => {
  let sql = `SELECT id, text, dateCreated, dateModerated, idUser, idUserAdmin, idNew FROM comments`;
  if (sortBy) {
    sql += ` ORDER BY ${sortBy}`;
  }
  const results = await connection.promise().query<IComment[]>(sql);
  return results[0];
};

const getCommentById = async (idComment: number): Promise<IComment> => {
  const [results] = await connection
    .promise()
    .query<IComment[]>(
      'SELECT id, text, dateCreated, dateModerated, idUser, idUserAdmin, idNew FROM comments WHERE id = ?',
      [idComment]
    );
  return results[0];
};

const addComment = async (comment: IComment): Promise<number> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>(
      'INSERT INTO comments (text, dateCreated, dateModerated, idUser, idUserAdmin, idNew) VALUES (?, ?, ?, ?, ?, ?)',
      [
        comment.text,
        comment.dateCreated,
        comment.dateModerated,
        comment.idUser,
        comment.idUserAdmin,
        comment.idNew,
      ]
    );
  return results[0].insertId;
};

const updateComment = async (
  idComment: number,
  comment: IComment
): Promise<boolean> => {
  let sql = 'UPDATE comments SET ';
  const sqlValues: Array<string | number | boolean> = [];
  let oneValue = false;

  if (comment.text) {
    sql += 'text = ? ';
    sqlValues.push(comment.text);
    oneValue = true;
  }
  if (comment.dateCreated) {
    sql += oneValue ? ', dateCreated = ? ' : ' dateCreated = ? ';
    sqlValues.push(comment.dateCreated);
    oneValue = true;
  }
  if (comment.dateModerated) {
    sql += oneValue ? ', dateModerated = ? ' : ' dateModerated = ? ';
    sqlValues.push(comment.dateModerated);
    oneValue = true;
  }
  if (comment.idUser) {
    sql += oneValue ? ', idUser = ? ' : ' idUser = ? ';
    sqlValues.push(comment.idUser);
    oneValue = true;
  }
  if (comment.idUserAdmin) {
    sql += oneValue ? ', idUserAdmin = ? ' : ' idUserAdmin = ? ';
    sqlValues.push(comment.idUserAdmin);
    oneValue = true;
  }
  if (comment.idNew) {
    sql += oneValue ? ', idNew = ? ' : ' idNew = ? ';
    sqlValues.push(comment.idNew);
    oneValue = true;
  }
  sql += ' WHERE id = ?';
  sqlValues.push(idComment);

  const results = await connection
    .promise()
    .query<ResultSetHeader>(sql, sqlValues);
  return results[0].affectedRows === 1;
};

const deleteComment = async (idComment: number): Promise<boolean> => {
  const results = await connection
    .promise()
    .query<ResultSetHeader>('DELETE FROM comments WHERE id = ?', [idComment]);
  return results[0].affectedRows === 1;
};

export {
  getAllComments,
  getCommentById,
  addComment,
  updateComment,
  deleteComment,
};
