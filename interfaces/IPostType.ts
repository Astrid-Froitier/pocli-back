import { RowDataPacket } from 'mysql2';

export default interface IPostType extends RowDataPacket {
  id: number;
  name: string;
}