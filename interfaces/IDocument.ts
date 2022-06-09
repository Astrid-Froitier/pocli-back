import { RowDataPacket } from 'mysql2';

export default interface IDocument extends RowDataPacket {
  id: number;
  url: string;
}
