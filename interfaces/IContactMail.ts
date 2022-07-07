import { RowDataPacket } from 'mysql2';

export default interface IContactMail extends RowDataPacket {
  civility: string;
  lastname: string;
  firstname: string;
  email: string;
  object: string;
  message: string;
}
