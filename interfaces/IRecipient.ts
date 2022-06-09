import { RowDataPacket } from 'mysql2';

export default interface IRecipient extends RowDataPacket {
  id: number;
  name: string;
}