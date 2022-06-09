import { RowDataPacket } from 'mysql2';

export default interface IEventDocument extends RowDataPacket {
  id: number;
  idDocument: number;
  idEvent: number;
}
