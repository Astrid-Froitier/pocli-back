import { RowDataPacket } from 'mysql2';

export default interface ICity extends RowDataPacket {
  id: number;
  name: string;
  zipCode: number;
}
