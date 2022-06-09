import { RowDataPacket } from 'mysql2';

export default interface IActivity extends RowDataPacket {
  id: number;
  name: string;
}
