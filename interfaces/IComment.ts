import { RowDataPacket } from 'mysql2';

export default interface IComment extends RowDataPacket {
  id: number;
  text: string;
  dateCreated: number;
  dateModerated: number;
  idUser: number;
  idUserAdmin: number;
  idNew: number;
}
