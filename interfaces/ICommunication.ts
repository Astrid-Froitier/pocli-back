import { RowDataPacket } from 'mysql2';

export default interface ICommunication extends RowDataPacket {
  id: number;
  object: string;
  content: string;
  date: string;
  idAdmin: number;
}
