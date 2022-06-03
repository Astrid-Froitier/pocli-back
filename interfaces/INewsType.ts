import { RowDataPacket } from 'mysql2';

export default interface INewsType extends RowDataPacket {
  id: number;
  name: string;
}
